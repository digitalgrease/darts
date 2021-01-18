/*
 * Copyright (c) Digital Grease Ltd.
 *
 * Wednesday 29th May 2019
 */

/*
 * Function to register a service worker if supported.
 */
function registerServiceWorker(serviceWorkerPath) {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(serviceWorkerPath)
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope:', registration.scope);
                }
            ).catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
        });
    } else {
        // DO TG Feature: Display a message to the user advising on using a different browser?
        // DO TG Feature: Send a notification to log the browser being used by the customer?
        console.log('Service workers are NOT supported');
    }
}

/*
 * Listen for the event to display the add to home screen option.
 */
let beforeInstallPromptEvent;
window.addEventListener('beforeinstallprompt', event => {
    console.log('Before install prompt event triggered!');
    // Prevent Chrome 67 and earlier from automatically showing the prompt.
    event.preventDefault();
    // Stash the event so it can be triggered later.
    beforeInstallPromptEvent = event;
    
    document.getElementById('installNotification').style.display = 'block';
});

/*
 * Adds an event listener to the install button to install the app.
 */
document.getElementById('installButton').addEventListener('click', event => {
    beforeInstallPromptEvent.prompt();
    beforeInstallPromptEvent.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
            console.log('User chose to install');
        } else {
            console.log('User chose NOT to install');
        }
        beforeInstallPromptEvent = null;
    });
});