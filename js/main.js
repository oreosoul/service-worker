if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then( restration => {
            // registration success
            console.log('Registration success:', restration.scope)
        }).catch( err => {
            // registration failed
            console.error('Registration failed:', err)
        })
    })
}