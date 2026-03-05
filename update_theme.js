const fs = require('fs');

function addThemeToggle(file) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add toggle button
    if (file === 'index.html') {
        const navRegex = /<a href="#contact"[\s\S]*?Contact[\s\S]*?<\/a>/;
        content = content.replace(navRegex, `
            <div class="flex items-center gap-4">
                <button id="theme-toggle" class="p-2 rounded-full hover:bg-white/10 transition-colors text-xl" title="Toggle Light/Dark Mode">
                    🌞
                </button>
                $&
            </div>`);
    } else if (file === 'checkout.html') {
        const navCheckoutRegex = /<button onclick="window\.history\.back\(\)"[\s\S]*?Back[\s\S]*?<\/button>/;
        content = content.replace(navCheckoutRegex, `
            <div class="flex items-center gap-4">
                <button id="theme-toggle" class="p-2 rounded-full hover:bg-white/10 transition-colors text-xl" title="Toggle Light/Dark Mode">
                    🌞
                </button>
                $&
            </div>`);
    }

    // 2. Add CSS
    const styleRegex = /body\s*{\s*background-color: #050505;\s*color: white;\s*overflow-x: hidden;\s*}/;
    const newStyle = `body {
            background-color: #050505;
            color: white;
            overflow-x: hidden;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        body.light-mode {
            background-color: #f8fafc;
            color: #0f172a;
        }
        
        body.light-mode .glass-card {
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
        }
        
        body.light-mode .text-gray-400 {
            color: #475569;
        }
        
        body.light-mode .text-gray-300 {
            color: #334155;
        }
        
        body.light-mode .bg-white\\/5, 
        body.light-mode .bg-white\\/10 {
            background-color: rgba(0, 0, 0, 0.05);
        }

        body.light-mode .border-white\\/5,
        body.light-mode .border-white\\/10,
        body.light-mode .border-white\\/20,
        body.light-mode .border-white\\/30 {
            border-color: rgba(0, 0, 0, 0.1);
        }
        
        body.light-mode .text-white {
            color: #0f172a;
        }

        body.light-mode input, 
        body.light-mode textarea, 
        body.light-mode select {
            color: #0f172a;
            background-color: rgba(255, 255, 255, 0.8);
            border-color: rgba(0, 0, 0, 0.2);
        }
        
        body.light-mode input::placeholder, 
        body.light-mode textarea::placeholder {
            color: #64748b;
        }
        
        body.light-mode nav.bg-white\\/5 {
            background-color: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        body.light-mode .bg-black\\/50 {
            background-color: #e2e8f0;
        }
        
        body.light-mode .bg-black\\/80 {
            background-color: rgba(255, 255, 255, 0.9) !important;
        }
        `;
    content = content.replace(styleRegex, newStyle);

    // 3. Add JS
    // Ensure we append before </body> tag
    const jsTheme = `
    <script>
        const themeToggle = document.getElementById('theme-toggle');
        
        // Check local storage for theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            if(themeToggle) themeToggle.textContent = '🌙';
        }

        if(themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                if (document.body.classList.contains('light-mode')) {
                    localStorage.setItem('theme', 'light');
                    themeToggle.textContent = '🌙';
                } else {
                    localStorage.setItem('theme', 'dark');
                    themeToggle.textContent = '🌞';
                }
            });
        }
    </script>
</body>`;
    // Only replace if not already there
    if (!content.includes("localStorage.getItem('theme')")) {
        const lastBodyIndex = content.lastIndexOf('</body>');
        if (lastBodyIndex !== -1) {
            content = content.substring(0, lastBodyIndex) + jsTheme + content.substring(lastBodyIndex + 7);
        }
    }

    fs.writeFileSync(file, content, 'utf8');
}

addThemeToggle('index.html');
addThemeToggle('checkout.html');
