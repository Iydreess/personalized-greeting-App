def calculate_discount(price, discount_percent):
    """
    Calculate the final price after applying a discount.
    
    Args:
        price (float): The original price of the item
        discount_percent (float): The discount percentage to apply
    
    Returns:
        float: The final price after discount (if applicable) or original price
    """
    if discount_percent >= 20:
        # Apply discount if it's 20% or higher
        discount_amount = price * (discount_percent / 100)
        final_price = price - discount_amount
        return final_price
    else:
        # Return original price if discount is less than 20%
        return price


def main():
    """Main function to handle user interaction"""
    try:
        # Prompt user for input
        original_price = float(input("Enter the original price of the item: KES "))
        discount_percentage = float(input("Enter the discount percentage: "))
        
        # Validate input
        if original_price < 0:
            print("Error: Price cannot be negative!")
            return
        
        if discount_percentage < 0:
            print("Error: Discount percentage cannot be negative!")
            return
        
        # Calculate the final price using the function
        final_price = calculate_discount(original_price, discount_percentage)
        
        # Display results
        if discount_percentage >= 20:
            print(f"\nDiscount applied: {discount_percentage}%")
            print(f"Original price: KES {original_price:,.2f}")
            print(f"Final price after discount: KES {final_price:,.2f}")
            print(f"You saved: KES {original_price - final_price:,.2f}")
        else:
            print(f"\nNo discount applied (discount must be 20% or higher)")
            print(f"Original price: KES {original_price:,.2f}")
            print(f"Final price: KES {final_price:,.2f}")
    
    except ValueError:
        print("Error: Please enter valid numbers for price and discount percentage!")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()