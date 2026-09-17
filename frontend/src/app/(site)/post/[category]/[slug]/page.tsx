import { resolveSitePathUrl, resolveSiteUrl } from "@sunub/contracts";
import type { FrontMatter, PostCategory } from "@sunub/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomMDXRemoteComponents from "@/components/ui/customMdxRemote";
import { NotFoundError } from "@/shared/error";
import { Wave } from "@/widgets/Wave";
import { getAllPosts } from "./api/getAllPosts";
import { getPostContentByCategoryAndSlug } from "./api/getPostContentByCategoryAndSlug";
import { ClientArticle } from "./ClientAritcle";
import { HeaderSection } from "./components/HeaderSection";
import { ArticleRootWrapper, ArticleWrapper, Main } from "./page.style";

export const dynamicParams = false;

const siteUrl = resolveSiteUrl({ env: process.env });
const defaultOgImageUrl = resolveSitePathUrl("/assets/default-og-image.jpg", {
	env: process.env,
});

type Params = Promise<{
	category: PostCategory;
	slug: string;
}>;

const parseIsoDate = (
	dateString: FrontMatter["date"] | undefined,
): string | null => {
	if (!dateString) {
		return null;
	}

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toISOString();
};

export async function generateStaticParams() {
	const allPosts = await getAllPosts();

	return allPosts.map(({ frontmatter }) => ({
		category: frontmatter.category,
		slug: frontmatter.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const { category, slug } = resolvedParams;

	try {
		const specificFrontmatter = await getPostContentByCategoryAndSlug(
			category,
			slug,
		);

		if (!specificFrontmatter) {
			return {
				title: "콘텐츠를 불러올 수 없습니다",
				description: "요청하신 콘텐츠를 불러오는 중 오류가 발생했습니다.",
			};
		}

		const { title, summary, date, tags } = specificFrontmatter.frontmatter;
		if (!title) {
			notFound();
		}
		const publishedDate = parseIsoDate(date);

		return {
			title,
			description: summary,
			keywords: tags.join(", "),
			openGraph: {
				title,
				description: summary,
				type: "article",
				...(publishedDate ? { publishedTime: publishedDate } : {}),
				authors: ["sun_ub"],
				tags,
				url: resolveSitePathUrl(`/post/${category}/${slug}`, {
					env: process.env,
				}),
			},
			twitter: {
				card: "summary_large_image",
				title,
				description: summary,
			},
			alternates: {
				canonical: resolveSitePathUrl(`/post/${category}/${slug}`, {
					env: process.env,
				}),
			},
		};
	} catch (error) {
		if (error instanceof NotFoundError) {
			notFound();
		}

		console.error("MDX 콘텐츠 메타데이터 생성 실패:", error);
		return {
			title: "콘텐츠를 불러올 수 없습니다",
			description: "요청하신 콘텐츠를 불러오는 중 오류가 발생했습니다.",
		};
	}
}

async function Page({ params }: { params: Params }) {
	const resolvedParams = await params;
	const { category, slug } = resolvedParams;

	try {
		const postContentData = await getPostContentByCategoryAndSlug(
			category,
			slug,
		);
		if (!postContentData) {
			return (
				<div className="warning">
					<h3>콘텐츠를 불러올 수 없습니다</h3>
					<p>죄송합니다. 요청하신 콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
				</div>
			);
		}

		const { content, frontmatter } = postContentData;
		const publishedDate = parseIsoDate(frontmatter.date);
		return (
			<>
				<Wave />
				<Main>
					<script type="application/ld+json" suppressHydrationWarning>
						{JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BlogPosting",
							headline: frontmatter.title,
							...(publishedDate
								? {
										datePublished: publishedDate,
										dateModified: publishedDate,
									}
								: {}),
							description: frontmatter.summary,
							author: {
								"@type": "Person",
								name: "sun_ub",
								url: siteUrl,
							},
							image: defaultOgImageUrl,
							mainEntryOfPage: {
								"@type": "WebPage",
								"@id": resolveSitePathUrl(`/post/${category}/${slug}`, {
									env: process.env,
								}),
							},
						})}
					</script>
					<ArticleRootWrapper id="blog-post__article-root">
						<HeaderSection frontmatter={frontmatter} />
						<ArticleWrapper id="blog-post__article">
							<ClientArticle>
								<CustomMDXRemoteComponents
									content={content}
									postImageContext={{ category }}
								/>
							</ClientArticle>
						</ArticleWrapper>
					</ArticleRootWrapper>
				</Main>
			</>
		);
	} catch (error) {
		console.error("MDX 콘텐츠를 불러오는 중 오류가 발생했습니다:", error);
		if (error instanceof NotFoundError) {
			notFound();
		}

		return (
			<div className="warning">
				<h3>콘텐츠를 불러올 수 없습니다</h3>
				<p>죄송합니다. 요청하신 콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
			</div>
		);
	}
}

export default Page;
