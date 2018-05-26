module.exports = {
    apps: [
        {
            name: "naswiki",
            script: "./build/service.js",
            watch: true,
            env: {
                "PORT": 8020,
                "NODE_ENV": "development"
            },
            env_production: {
                "PROXY_HOST": "localhost",
                "PROXY_PORT": 8022,
                "PORT": 8020,
                "NODE_ENV": "production",
            }
        }
    ]
};