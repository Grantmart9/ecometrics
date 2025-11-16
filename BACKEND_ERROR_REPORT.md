Authentication is working now, i'm getting a 500 internal server error. I think CRUD is not happy with something. Let me know if I should change my payload or can you make the changes on the backend.

# Backend Error Report: NullReferenceException on Input Submission

## Status: Backend Bug - Requires Backend Team Fix

---

## Error Details

**Error Type:** `System.NullReferenceException`  
**Message:** "Object reference not set to an instance of an object."  
**Location:** `CrudController.cs:line 29` in `GetRowsMatchPartial` method  
**HTTP Status:** 500 Internal Server Error

---

## Reproduction Steps

1. Navigate to: `https://wecare.temo.co.za/input`
2. Click on "Enter Data" tab
3. Fill in form with these values:
   - Activity Type: "Stationary Fuels"
   - Cost Centre: "FIN"
   - Start Date: "2025-11-12"
   - End Date: "2025-11-12"
   - Consumption Type: "Coal"
   - Consumption: 200
   - Monetary Value: 20000
   - Notes: (empty)
4. Click "Submit"
5. Backend crashes with 500 error

---

## Payload Being Sent

Frontend sends this correct CRUD request structure:

```json
{
  "resource": "emissions-input",
  "operation": "create",
  "data": {
    "activityType": "Stationary Fuels",
    "costCentre": "FIN",
    "startDate": "2025-11-12",
    "endDate": "2025-11-12",
    "consumptionType": "Coal",
    "consumption": 200,
    "monetaryValue": 20000,
    "notes": ""
  },
  "requestId": "req_1763041335040_nksir88wl"
}
```

**Request Details:**

- URL: `https://api.temo.co.za/advice/dev/crud/crud`
- Method: POST
- Headers: `Content-Type: application/json`
- Credentials: Cookies included (authentication working ✅)

---

## Stack Trace Analysis

```
at NACAdministration.API.Controllers.CrudController.GetRowsMatchPartial(TempObjectModelCrud data)
in C:\GitLab-Runner\builds\y8u_MMY8\0\td\temo-consulting\advice\advice\NACAdministration.API\Controllers\CRUDController.cs:line 29
```

The error occurs in the `GetRowsMatchPartial` method, which suggests the backend is trying to access a property or object that is null.

---

## Likely Causes

### 1. Missing Required Fields

The backend might expect additional fields that aren't being sent:

- `userId` or `personId` (should be extracted from authenticated session)
- `companyId` or `organizationId`
- `emissionFactorId`
- Database-specific fields

### 2. Null Property Access

The `GetRowsMatchPartial` method might be accessing a property without null checking:

```csharp
// Line 29 might look like this:
var result = data.SomeProperty.SomeMethod(); // If SomeProperty is null, this crashes
```

### 3. Database Constraints

The database table might have:

- NOT NULL constraints on fields we're not sending
- Foreign key constraints that aren't being satisfied
- Required relationships that aren't being populated

---

## Required Backend Fixes

### Priority 1: Add Null Safety

In `CrudController.cs` at line 29:

```csharp
// BEFORE (crashes):
public HttpResponseMessage GetRowsMatchPartial(TempObjectModelCrud data)
{
    var result = data.SomeProperty.ProcessData(); // Line 29 - crashes if SomeProperty is null
    // ...
}

// AFTER (safe):
public HttpResponseMessage GetRowsMatchPartial(TempObjectModelCrud data)
{
    if (data == null || data.SomeProperty == null)
    {
        return Request.CreateResponse(
            HttpStatusCode.BadRequest,
            new { Status = 400, Message = "Invalid data: SomeProperty is required" }
        );
    }

    var result = data.SomeProperty.ProcessData(); // Line 29 - now safe
    // ...
}
```

### Priority 2: Log Missing Fields

Add logging to identify which field is null:

```csharp
public HttpResponseMessage GetRowsMatchPartial(TempObjectModelCrud data)
{
    // Log what we received
    Logger.Debug($"GetRowsMatchPartial called with: {JsonConvert.SerializeObject(data)}");

    // Check each property
    if (data.Resource == null) Logger.Error("Resource is null");
    if (data.Operation == null) Logger.Error("Operation is null");
    if (data.Data == null) Logger.Error("Data is null");
    // ... check all properties

    // Continue with processing
}
```

### Priority 3: Return Better Error Messages

Instead of generic 500 errors, return specific validation errors:

```csharp
if (string.IsNullOrEmpty(emissionsData.UserId))
{
    return Request.CreateResponse(
        HttpStatusCode.BadRequest,
        new {
            Status = 400,
            Message = "UserId is required but was not found in session",
            Field = "userId"
        }
    );
}
```

---

## Recommended Backend Investigation Steps

1. **Check CrudController.cs line 29**
   - What property is being accessed?
   - Is there a null check?
   - What does the method expect to receive?

2. **Verify Database Schema**
   - What columns exist in the `emissions-input` table?
   - What fields are NOT NULL?
   - Are there any foreign keys?

3. **Check TempObjectModelCrud Model**
   - What properties does it have?
   - Are any properties required?
   - Does it match the incoming JSON structure?

4. **Review Create Operation Handler**
   - How does the CRUD controller process "create" operations?
   - Does it add userId from the session?
   - Are all required fields being populated?

---

## Workaround (Temporary)

Until backend is fixed, you can:

1. **Use localStorage fallback** (already implemented in frontend for static export)
2. **Contact backend team** with this error report
3. **Test with different data** to see if certain values trigger the error

---

## Frontend Code Location

The submission code is in:

- File: `app/input/page.tsx`
- Lines: 299-392 (handleFormSubmit function)
- CRUD call: Line 356 (`crudService.create("emissions-input", payload)`)

---

## Authentication Status

✅ **Authentication is working correctly**

- Login successful on wecare.temo.co.za
- Cookies being sent with requests
- No 401 errors

The 500 error is purely a backend data processing issue, not an authentication problem.

---

## Next Steps

1. **Backend team** should:
   - Check `CrudController.cs` line 29
   - Add null safety checks
   - Return specific validation errors
   - Test with the provided payload

2. **Frontend** is ready and working - no changes needed on our side

3. **After backend fix**, test again with the same data to verify

---

## Contact

For questions about this error report or the payload structure, contact the frontend development team.

---

## Related Issues

This is a **separate issue** from the previous 401 authentication errors, which have been fully resolved by deploying to wecare.temo.co.za.
