import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

await mkdir('./screenshots_v5', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000');
await page.waitForTimeout(1000);

await page.screenshot({ path: './screenshots_v5/accueil.png', fullPage: false });

await page.click('label:has-text("Cosmétovigilance")');
await page.waitForTimeout(200);
await page.screenshot({ path: './screenshots_v5/accueil_sel.png' });

await page.click('button:has-text("Commencer")');
await page.waitForTimeout(500);
await page.screenshot({ path: './screenshots_v5/step1.png' });

await page.fill('input[placeholder="Dupont"]', 'Dupont');
await page.fill('input[placeholder="Marie"]', 'Marie');
await page.fill('input[placeholder="30"]', '35');
await page.fill('input[placeholder="marie@email.com"]', 'marie@email.com');
await page.fill('input[placeholder="+33 6 00 00 00 00"]', '+33 6 00 00 00 00');
await page.fill('input[placeholder="Rue de la Paix"]', 'Rue de la Paix');
await page.fill('input[placeholder="Paris"]', 'Paris');
await page.fill('input[placeholder="75001"]', '75001');
await page.locator('select').last().selectOption('France');
await page.click('button:has-text("Continuer")');
await page.waitForTimeout(500);
await page.screenshot({ path: './screenshots_v5/step2.png' });

await page.locator('select').first().selectOption('Marque Propre Marionnaud');
await page.fill('input[placeholder="Nom du produit"]', 'Crème hydratante visage');
await page.locator('input[type="date"]').first().fill('2026-12-31');
await page.click('button:has-text("Continuer")');
await page.waitForTimeout(500);
await page.screenshot({ path: './screenshots_v5/step3.png' });

await page.locator('input[type="date"]').first().fill('2026-05-01');
await page.locator('label').filter({ hasText: "Consultation d'un médecin" }).click();
await page.locator('label').filter({ hasText: 'Visage' }).click();
await page.fill('textarea', 'Rougeurs importantes après application de la crème sur le visage.');
await page.click('button:has-text("Continuer")');
await page.waitForTimeout(500);
await page.screenshot({ path: './screenshots_v5/step4.png' });

await browser.close();
