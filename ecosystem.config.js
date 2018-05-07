module.exports = {
    apps: [
        {
            name: "modianwiki",
            script: "./build/service.js",
            watch: true,
            env: {
                "PORT": 8088,
                "NODE_ENV": "development"
            },
            env_production: {
                "PROXY_HOST": "localhost",
                "PROXY_PORT": 8090,
                "PORT": 8088,
                "NODE_ENV": "production",
                "REGISTOR": true
            }
        }
    ]
};