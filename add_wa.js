const fs = require('fs');
let txt = fs.readFileSync('app/layout.tsx', 'utf8');

txt = txt.replace('import { Providers } from "./providers";', 'import { Providers } from "./providers";\nimport WhatsAppButton from "@/components/WhatsAppButton";');

txt = txt.replace('<Providers>{children}</Providers>', '<Providers>\n          {children}\n          <WhatsAppButton />\n        </Providers>');

fs.writeFileSync('app/layout.tsx', txt, 'utf8');
console.log('Added WhatsAppButton to layout');
