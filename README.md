# Gluco
A web application to visualize the glycemic indexes of various foods, helping both diabetic and non-diabetic people understand how different foods may impact their blood sugar levels.

FYI: The glycemic index (GI) is a scale that ranks a carbohydrate-containing food or drink by how much it raises blood sugar levels after it is eaten or drank. Glycemic Load (GL) considers both the GI and the amount of carbohydrate in a typical serving of food and is a more accurate representation of the food's impact on a person's blood sugar levels. It is recommended that everyone for good overall health and well-being should aim to consume foods with a total glycemic load (GL) of 100 or less per day (source: https://www.everydayhealth.com/diet-nutrition/101/nutrition-basics/the-glycemic-load.aspx).

Dataset obtained from: https://researchdata.edu.au/international-glycemic-index-gi-database/11115

# Why did I choose this dataset?
A significant number of people in my family, including both of my parents, live with diabetes. After moving to Canada, we’ve encountered a recurring challenge: most healthcare providers often lack familiarity with Indian vegetarian foods that support healthy blood sugar levels. While they have positive intentions, many physicians and specialists default to suggesting generic foods like 'chickpeas', which fail to account for our cultural dietary habits and nutritional needs.

This personal experience opened my eyes to a broader systemic issue. Diabetes is one of the world's leading chronic illnesses, yet healthcare systems in Western countries often lack the cultural awareness and data-driven resources needed to provide personalized and inclusive care for all those part of culturally diverse populations. For many immigrant families, this results in dietary guidance that’s ineffective, irrelevant, or difficult to follow, further widening the gap in accessibility to effective healthcare.

Motivated by this problem, I designed and built 'Gluco' using p5.js, HTML/CSS, and RiTa.js. This interactive data visualization tool maps glycemic index (GI) and glycemic load (GL) values to a diverse range of global foods, allowing users to filter by cuisine type, generate diabetic-friendly meal combinations and more! The primary goal of this program is to raise awareness about the importance of maintaining a balanced, healthy daily diet to control blood sugar levels and help prevent the onset of diabetes in people who are not yet diagnosed.

# How to use it?
Click on each of the rings to learn more about the various foods. You can get specific information about GI values, carbohydrate content, and GL values. The colors represent the ranges of GI: green --> low GI (55 or less), yellow --> medium GI (56 to 69), and red --> high GI (70 or more). 

1. Using the radio buttons, you can sort the rings/food items based on certain types of cuisines.
2. The dropdown menu allows you to sort the rings in ascending GI value order or in color buckets.
3. The search bar enables you to type in queries like "under 30g of carbs" or "greater than 40g of carbs" and will output rings that matches the threshold of carbs content you provided.
4. By clicking the 'Suggest Meal Plan' button, you'll receive a random combination of three meals for the day, with a combined glycemic load (GL) total of 100 or less.

Here's a quick demo: 
[![Watch the video](https://img.youtube.com/vi/qwG3npOBe4o/0.jpg)](https://youtu.be/qwG3npOBe4o)



