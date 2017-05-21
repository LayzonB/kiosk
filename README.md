# KIOSK for Stripe:

- was developed using latest technologies and applying best practices for web application development and design;
- is a single page web app that extends a Stripe account with a standalone shopping cart;
- operates autonomously via Stripe API to reduce seller administrative overhead;
- relies on Stripe products and orders, in addition to payments, to operate;
- was specifically optimised for shippable products;
- does not allow user registration or authentication of any kind;
- is primarily optimised for mobile, strictly adhering to the Google Material Design specification;
- frontend is built using AngularJS and jQuery frameworks;
- frontend programmatically implements UI styling and templating, effectively reducing the code footprint;
- has very little backend code that acts as a glue between the frontend and the Stripe platform;
- backend was written in Python;
- backend runs on Google App Engine;
- backend caches Stripe API responses for improved user experience;
- is not SEO friendly;
- is not social media friendly;
- does not implement any kind of user agent analytics;
- user interface and workflow are not customizable;
- does not implement static CSS or HTML for styling and templating.


# Installation

Prior installing the KIOSK, you should have defined products on your Stripe account. Consult the Stripe documentation on how to setup your Stripe account and create products with valid SKUs.

1. Login to Google Developers Console https://console.developers.google.com using your Gmail account. For assistance with ongoing steps consult the help inside the console. 

2. Select a project, or create a new one, to use for installing the app.

3. Open the Cloud Shell.

4. Clone this GitHub repository by typing "git clone https://github.com/miraclestyle/kiosk.git".

5. Enter kiosk dir "cd kiosk/" and create a dir named lib/ "mkdir lib".

6. Install Stripe API library for python by typing "pip install -t lib/ stripe".

7. Launch code editor from the Cloud Shell taskbar, and navigate to the kiosk folder in order to edit app.yaml and settings.py.

8. From the code editor, open app.yaml and replace the "project-id" value of the "application" key with your project ID.

9. From the code editor, open settings.py and replace the "stripe_secret_key" and "stripe_public_key" variable values with valid Stripe API keys. 

10. Optionally, you can modify UI messages, labels, instructions, etc., by opening static/app/settings.json and modifying values on referenced keys.

11. Go back to Cloud Shell and deploy the application by running "appcfg.py update app.yaml".

# Roadmap

Coming soon...
