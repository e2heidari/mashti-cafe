# How to Add Wholesale Products to Sanity CMS

## Option 1: Manual Addition through Sanity Studio (Recommended)

1. **Start your Sanity Studio**:

   ```bash
   npm run dev
   ```

2. **Open Sanity Studio** in your browser (usually at `http://localhost:3000/studio`)

3. **Navigate to "Wholesale Product"** in the left sidebar

4. **Click "Create new document"** and add each product manually:

### Product 1: AKBAR MASHTI ICE CREAM (4Kg)

- **Name**: AKBAR MASHTI ICE CREAM
- **Description**: Traditional Persian ice cream with saffron and rose water
- **Ingredients**: Milk, Saffron, Rose Water, Cream, Pistachios
- **Weight**: ~4Kg
- **Price**: 65.0
- **Order**: 1
- **Active**: ✓ (checked)

### Product 2: AKBAR MASHTI ICE CREAM (10Kg)

- **Name**: AKBAR MASHTI ICE CREAM
- **Description**: Traditional Persian ice cream with saffron and rose water
- **Ingredients**: Milk, Saffron, Rose Water, Cream, Pistachios
- **Weight**: ~10Kg
- **Price**: 130.0
- **Order**: 2
- **Active**: ✓ (checked)

### Product 3: MILK ICE CREAM (4Kg)

- **Name**: MILK ICE CREAM
- **Description**: Creamy milk ice cream with rose water
- **Ingredients**: Milk, Rose Water, Cream
- **Weight**: ~4Kg
- **Price**: 45.0
- **Order**: 3
- **Active**: ✓ (checked)

### Product 4: MILK ICE CREAM (10Kg)

- **Name**: MILK ICE CREAM
- **Description**: Creamy milk ice cream with rose water
- **Ingredients**: Milk, Rose Water, Cream
- **Weight**: ~10Kg
- **Price**: 90.0
- **Order**: 4
- **Active**: ✓ (checked)

### Product 5: SAFFRON ICE CREAM (4Kg)

- **Name**: SAFFRON ICE CREAM
- **Description**: Premium saffron ice cream with authentic Persian flavors
- **Ingredients**: Milk, Saffron, Rose Water, Cream
- **Weight**: ~4Kg
- **Price**: 55.0
- **Order**: 5
- **Active**: ✓ (checked)

### Product 6: SAFFRON ICE CREAM (10Kg)

- **Name**: SAFFRON ICE CREAM
- **Description**: Premium saffron ice cream with authentic Persian flavors
- **Ingredients**: Milk, Saffron, Rose Water, Cream
- **Weight**: ~10Kg
- **Price**: 110.0
- **Order**: 6
- **Active**: ✓ (checked)

## Option 2: Using the Script

1. **Get your Sanity token**:
   - Go to https://www.sanity.io/manage/eh05fgze/api
   - Create a new token with write permissions
   - Copy the token

2. **Update the script**:
   - Open `add-products-manual.js`
   - Replace `YOUR_TOKEN_HERE` with your actual token

3. **Run the script**:
   ```bash
   node add-products-manual.js
   ```

## After Adding Products

Once you've added the products, they will automatically appear on your wholesale page at `/wholesale` when you click "Order" or "View Products".

The products will be fetched from Sanity CMS and displayed with all the cart functionality working properly.
