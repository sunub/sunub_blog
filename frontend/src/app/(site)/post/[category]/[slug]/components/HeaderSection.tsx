import type { FrontMatter } from "@sunub/types";
import React from "react";
import {
	ArticleHeader,
	HeaderEyebrow,
	HeaderMetaRow,
	HeaderSummary,
	HeaderTag,
	HeaderTagList,
	PostTitle,
	Time,
} from "../page.style";

const formatCategoryLabel = (category: FrontMatter["category"]) =>
	category
		.replace(/-/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

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

export async function HeaderSection({
	frontmatter,
}: {
	frontmatter: FrontMatter;
}) {
	const { title, date, summary, tags, category } = frontmatter;
	const publishDateIso = parseIsoDate(date);
	if (!publishDateIso) {
		return (
			<ArticleHeader>
				<HeaderEyebrow>{formatCategoryLabel(category)}</HeaderEyebrow>
				<PostTitle data-testid={"post-article__main-title"}>{title}</PostTitle>
				{summary ? <HeaderSummary>{summary}</HeaderSummary> : null}
				<React.Suspense fallback={<p>...</p>}>
					<HeaderMetaRow>
						<Time dateTime="">날짜 정보 없음</Time>
						<HeaderTagList>
							{tags.map((tag) => (
								<HeaderTag key={tag}>{tag}</HeaderTag>
							))}
						</HeaderTagList>
					</HeaderMetaRow>
				</React.Suspense>
			</ArticleHeader>
		);
	}

	const publishDate = new Date(publishDateIso);
	return (
		<ArticleHeader>
			<HeaderEyebrow>{formatCategoryLabel(category)}</HeaderEyebrow>
			<PostTitle data-testid={"post-article__main-title"}>{title}</PostTitle>
			{summary ? <HeaderSummary>{summary}</HeaderSummary> : null}
			<React.Suspense fallback={<p>...</p>}>
				<HeaderMetaRow>
					<Time dateTime={publishDateIso}>
						{new Intl.DateTimeFormat("ko-KR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						}).format(publishDate)}
					</Time>
					<HeaderTagList>
						{tags.map((tag) => (
							<HeaderTag key={tag}>{tag}</HeaderTag>
						))}
					</HeaderTagList>
				</HeaderMetaRow>
			</React.Suspense>
		</ArticleHeader>
	);
}
