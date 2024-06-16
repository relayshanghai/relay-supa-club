-- Step 1: Create a new temporary column
ALTER TABLE
prices
ADD
COLUMN temp_price DECIMAL(10, 2);

-- Step 2: Update the new column with values from the existing column
UPDATE
prices
SET
  temp_price = price::DECIMAL(10, 2);

-- Step 3: Drop the existing column
ALTER TABLE
prices DROP COLUMN price;

-- Step 4: Rename the temporary column to the original column name
ALTER TABLE
prices RENAME COLUMN temp_price TO price;

-- create column original_price with decimal(10,2) type
ALTER TABLE
prices
ADD
COLUMN original_price DECIMAL(10, 2);
