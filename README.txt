Restaurant Ordering Website
Mia Chen

Installation ----------------------------------------------------

Since node_modules folder is not submitted, please open terminal and type in “npm i” to install the package. Then type in “node service.js” to run the server. Open browser, type in http://localhost:3000/

Registration, logging in/out ------------------------------------

Now we are in the login/register page. Enter the username and password you want and click “Register” - account A, you will receive a message “user created”. Then go back to the previous page, enter the username and password again then click “login”.

Now we are in the profile for your account. You could logout by clicking “logout” on the profile page.

In regard to test easily, you could use another browser to login both accounts, like using IE to login account B and chrome to login account A. After you registered the first account, please refresh the browser before you register the second account.

The profile page also shows the cards you hold, which are randomly selected for each account.

Friend ----------------------------------------------------------

Friends could be search on the right-hand side of the profile page. After searching, you could click on the name and see what cards this account hold, all cards could be clicking to check the detail. Beside the name on the searching page, there’s an “add” button which could be clicked to add the friend. Please remember to register another account – account B - before you take search and add action, there’s no saved data in the database.

After you asked account A to add a friend with account B, if you log in account B, there’s a
 
pending request from account A. Account B could be able to “accept” or “reject” the request. After account B accept the request, as the webpage is refreshed automatically every 10 seconds, you could see account B is shown on account A’s profile page – friends’ section after the webpage automatically refresh.


Trades ----------------------------------------------------------

At the bottom of the profile page, there’s trading area. The dropdown menu lists all the friends that you could trade with. Account B will show up when you open the dropdown menu on account A’s profile page now. By selecting account B, you will go in to the trade page.

The trade page lists all cards you and account B hold, separated by holder. Cards could be selected for trading. After you select cards and click “trade”, data will be sent to the server and stored in database.

On account B’s profile page, you could find the pending trade request from account A. By clicking in, there’s the trade ID. 

More info are in the common on server.js and user-router.js