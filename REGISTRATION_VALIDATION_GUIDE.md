# Registration Validation Guide

This guide explains the validation checks implemented in the registration process and provides database setup instructions.

## Overview

The registration process is divided into 4 steps with comprehensive validation at each step to ensure data quality and security.

## Validation Checks

### Step 1: Personal Information

**Required Fields:**

- First Name ✓
- Last Name ✓
- Mobile Number ✓ (11 digits, numbers only)
- Gender ✓ (Male/Female/Other)
- Email (validated at final submission)

**Optional Fields:**

- Profile Image (recommended but not required)
- Alternative Mobile Number
- Birthday
- Blood Group
- Father's Name
- Mother's Name
- NID Number

**Validation Rules:**

- First Name: Cannot be empty
- Last Name: Cannot be empty
- Mobile Number: Must be exactly 11 digits
- Gender: Must be selected from dropdown
- Email: Validated on final submission (must be valid email format)

### Step 2: Address & Institution

**Required Fields:**

- Batch (HSC Year) ✓

**Optional Fields:**

- Institution (defaults to "Char Mehar Azizia High School")
- Group (Science/Commerce/Arts)
- Current Address (Line 1, Line 2, City, District, Postcode, Country)
- Permanent Address (Line 1, Line 2, City, District, Postcode, Country)

**Validation Rules:**

- Batch: Must be selected from dropdown (years from 1976 to current year)
- All address fields are optional to allow flexibility

### Step 3: Professional Information

**All fields are optional:**

- Designation
- Professional Information
- Profession
- Marital Status
- Spouse Name (only if Married or Widowed)
- Number of Children (only if Married or Widowed)
- Other Information

**Validation Rules:**

- Spouse Name and Number of Children only required if marital status is "Married" or "Widowed"

### Step 4: Account Setup

**Required Fields:**

- Password ✓ (minimum 6 characters)
- Confirm Password ✓ (must match password)
- Agreement ✓ (must accept terms and conditions)

**Validation Rules:**

- Password: Minimum 6 characters
- Confirm Password: Must match password exactly
- Agreement: Must be checked

## Final Submission Validation

Before the form is submitted, the following validations are performed:

1. **Email Validation:**

   - Must be in valid email format (e.g., user@example.com)
   - Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

2. **Mobile Number Validation:**

   - Must be exactly 11 digits
   - Only numbers allowed
   - Regex: `/^[0-9]{11}$/`

3. **Password Validation:**

   - Minimum 6 characters
   - Must match confirmation password

4. **Agreement Validation:**
   - Terms and conditions checkbox must be checked

## Database Setup

### Required Tables

1. **users table:**

   - id (UUID, Primary Key)
   - email (TEXT)
   - phone (TEXT)
   - first_name (TEXT)
   - last_name (TEXT)
   - profile_image_url (TEXT)
   - blood_group (TEXT)
   - gender (TEXT)
   - batch (TEXT)
   - location (TEXT)
   - role (TEXT, default: 'member')
   - is_approved (BOOLEAN, default: true)
   - nid_number (TEXT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **member_details table:**
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to users.id)
   - father_name (TEXT)
   - mother_name (TEXT)
   - institution (TEXT)
   - group (TEXT)
   - batch_hsc (TEXT)
   - address_line1 (TEXT)
   - address_line2 (TEXT)
   - city (TEXT)
   - district (TEXT)
   - postcode (TEXT)
   - country (TEXT)
   - permanent_address_line1 (TEXT)
   - permanent_address_line2 (TEXT)
   - permanent_city (TEXT)
   - permanent_district (TEXT)
   - permanent_postcode (TEXT)
   - permanent_country (TEXT)
   - designation (TEXT)
   - professional_info (TEXT)
   - profession (TEXT)
   - marital_status (TEXT)
   - spouse_name (TEXT)
   - number_of_children (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

### Running Database Setup

To set up the database with all required columns and validation:

1. Open your Supabase SQL Editor
2. Open the file `REGISTRATION_VALIDATION_SETUP.sql`
3. Copy and paste the entire SQL script
4. Click "Run" to execute

The script will:

- ✅ Create missing columns in users table
- ✅ Create missing columns in member_details table
- ✅ Create necessary indexes for better performance
- ✅ Set up Row Level Security (RLS) policies
- ✅ Add data validation constraints
- ✅ Verify all columns are properly set up

### Verification

After running the setup script, you should see:

- A list of all columns in the users table
- A list of all columns in the member_details table
- Success message confirming setup completion

## Features After Registration

Once a user completes registration:

1. **Automatic Redirect:**

   - User is automatically redirected to the login page after 1.5 seconds
   - Success toast notification is displayed

2. **Auto-Approval:**

   - New users are automatically approved (`is_approved = true`)
   - Can log in immediately after registration

3. **Profile Image:**

   - Cropped profile image is uploaded to Supabase Storage
   - Public URL is stored in the database

4. **Complete Profile:**
   - All entered information is saved across two tables
   - Users and member_details are linked via user_id

## Security Features

1. **Row Level Security (RLS):**

   - Users can only view/edit their own data
   - Admins can view/edit all users
   - Registration is open to everyone

2. **Password Security:**

   - Passwords are hashed by Supabase Auth
   - Minimum 6 characters required
   - Never stored in plain text

3. **Email Verification:**

   - Supabase Auth handles email verification
   - Users receive confirmation email

4. **Data Validation:**
   - Email format validation
   - Mobile number format validation
   - Gender and role constraints
   - Marital status constraints

## Error Handling

The registration process includes comprehensive error handling:

1. **Network Errors:**

   - Displays user-friendly error messages
   - Suggests retry or contact support

2. **Validation Errors:**

   - Specific field-level error messages
   - Prevents form submission until fixed

3. **Database Errors:**

   - Catches and displays database errors
   - Prevents partial data insertion

4. **Rate Limiting:**
   - Handles Supabase rate limiting
   - Shows appropriate message to user

## Testing Checklist

Before deploying, test the following:

- [ ] Can complete registration with all required fields
- [ ] Cannot proceed to next step without required fields
- [ ] Email validation catches invalid emails
- [ ] Mobile number validation catches invalid numbers
- [ ] Password must be at least 6 characters
- [ ] Passwords must match
- [ ] Agreement checkbox must be checked
- [ ] Profile image upload works
- [ ] Image cropping works
- [ ] Redirect to login page after registration
- [ ] Can log in with new credentials
- [ ] All data saved correctly in database

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify database setup was completed
3. Check Supabase Auth settings
4. Ensure storage bucket "members" exists
5. Verify RLS policies are set up correctly

## Updates and Maintenance

When adding new fields:

1. Add column to database using migration
2. Update TypeScript interfaces
3. Add field to formData state
4. Add to appropriate step
5. Update validation if required
6. Update this documentation
