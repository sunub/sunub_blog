// import { expect, type Page, test } from "@playwright/test";

// const VIEWPORTS = [
// 	{ width: 1024, height: 768, name: "Desktop/Tablet (1024px)" },
// 	{ width: 768, height: 1024, name: "Tablet (768px)" },
// 	{ width: 425, height: 932, name: "Mobile (425px)" },
// ];

// async function enableDeterministicMode(page: Page) {
// 	await page.evaluate(() => {
// 		document.documentElement.setAttribute("data-test-mode", "true");
// 	});
// 	await page.addStyleTag({
// 		content: `
//       .hero-image-section {
//         display: none !important;
//       }
//       ::-webkit-scrollbar {
//         display: none !important;
//       }
//       * {
//         scrollbar-width: none !important;
//         -ms-overflow-style: none !important;
//       }
//     `,
// 	});
// }

// async function waitForImagesToLoad(page: Page) {
// 	await page.evaluate(async () => {
// 		const imgs = Array.from(document.querySelectorAll("img"));
// 		await Promise.all(
// 			imgs.map((img) => {
// 				if (img.complete) return Promise.resolve();
// 				return new Promise((resolve) => {
// 					img.addEventListener("load", resolve);
// 					img.addEventListener("error", resolve);
// 				});
// 			}),
// 		);
// 	});
// }

// test.describe("반응형 레이아웃 시각적 회귀 테스트", () => {
// 	test.skip(
// 		({ isMobile }) => isMobile,
// 		"반응형 레이아웃 테스트는 자체 뷰포트 크기 조정을 처리하며 데스크톱 프로젝트에서만 실행됩니다.",
// 	);

// 	for (const vp of VIEWPORTS) {
// 		test.describe(`뷰포트: ${vp.name}`, () => {
// 			test.use({ viewport: { width: vp.width, height: vp.height } });

// 			test(`${vp.width}px 크기에서 홈 페이지 컴포넌트가 올바르게 렌더링되어야 합니다`, async ({
// 				page,
// 			}) => {
// 				await test.step("홈 페이지 이동 및 레이아웃 안정화", async () => {
// 					await page.goto("/");
// 					await enableDeterministicMode(page);
// 					await page.waitForLoadState("networkidle");
// 					await waitForImagesToLoad(page);
// 				});

// 				await test.step("헤더 내비게이션 레이아웃 스크린샷 검증", async () => {
// 					const headerNav = page.getByRole("banner").first();
// 					await expect(headerNav).toHaveScreenshot({
// 						animations: "disabled",
// 						maxDiffPixelRatio: 0.08,
// 						threshold: 0.2,
// 					});
// 				});

// 				await test.step("메인 콘텐츠 레이아웃 스크린샷 검증", async () => {
// 					const mainContent = page.getByRole("main").first();
// 					await expect(mainContent).toHaveScreenshot({
// 						animations: "disabled",
// 						maxDiffPixelRatio: 0.08,
// 						threshold: 0.2,
// 					});
// 				});
// 			});

// 			test(`${vp.width}px 크기에서 아카이브 페이지 컴포넌트가 올바르게 렌더링되어야 합니다`, async ({
// 				page,
// 			}) => {
// 				await test.step("아카이브 페이지 이동 및 레이아웃 안정화", async () => {
// 					await page.goto("/archive/all");
// 					await enableDeterministicMode(page);
// 					await page.waitForLoadState("networkidle");
// 					await waitForImagesToLoad(page);
// 				});

// 				await test.step("아카이브 콘텐츠 시각적 레이아웃 스크린샷 검증", async () => {
// 					const mainContent = page.getByRole("main").first();
// 					await expect(mainContent).toHaveScreenshot({
// 						animations: "disabled",
// 						maxDiffPixelRatio: 0.08,
// 						threshold: 0.2,
// 					});
// 				});
// 			});
// 		});
// 	}

// 	test.describe("동적 리사이즈 안정성 테스트", () => {
// 		test("데스크톱에서 모바일로 크기 변경 시 안정적인 레이아웃이 유지되어야 합니다", async ({
// 			page,
// 		}) => {
// 			await page.setViewportSize({ width: 1024, height: 768 });
// 			await page.goto("/");
// 			await enableDeterministicMode(page);
// 			await page.waitForLoadState("networkidle");
// 			await waitForImagesToLoad(page);

// 			await test.step("모바일 크기로 리사이즈 후 레이아웃 안정성 검증", async () => {
// 				await page.setViewportSize({ width: 425, height: 932 });
// 				await page.waitForTimeout(500);

// 				const hasHorizontalScroll = await page.evaluate(() => {
// 					return (
// 						document.documentElement.scrollWidth >
// 						document.documentElement.clientWidth
// 					);
// 				});
// 				expect(hasHorizontalScroll).toBe(false);

// 				const hamburgerBtn = page.getByRole("button", { name: "Open menu" });
// 				await expect(hamburgerBtn).toBeVisible();
// 			});
// 		});
// 	});
// });
