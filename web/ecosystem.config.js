module.exports = {
    apps: [
        {
            name: 'rteuhayat-web',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
                NEXTAUTH_URL: 'https://rteuhayat.org',
                NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};
