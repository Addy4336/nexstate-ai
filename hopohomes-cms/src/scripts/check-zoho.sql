-- Check if Zoho tokens exist and when they were created
SELECT 
    id,
    CASE 
        WHEN refresh_token IS NOT NULL THEN 'Yes'
        ELSE 'No'
    END as has_refresh_token,
    created_at,
    updated_at,
    expires_at,
    CASE 
        WHEN expires_at > NOW() THEN 'Valid'
        ELSE 'Expired'
    END as token_status
FROM zoho_tokens 
WHERE id = 1;

-- To clear tokens and start fresh, uncomment the line below:
-- DELETE FROM zoho_tokens WHERE id = 1;
