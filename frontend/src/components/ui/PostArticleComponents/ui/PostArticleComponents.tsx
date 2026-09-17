import React, { createElement } from "react";
import { MDXComponents } from "@/MDXContents";
import { Blockquote } from "./BlockQuote";
import { CodeBlock, InlineCode } from "./CodeBlock";
import { CustomLink } from "./CustomLink";
import { HorizontalRule } from "./HorizontalRule";
import { ListItem } from "./ListItem";
import { OrderedList } from "./OrderedList";
import {
	Emphasis,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	LinkAnchor,
	LinkSVG,
	P,
	ParagraphFlow,
	Pre,
	Strong,
} from "./PostArticleComponents.style";
import { PostImage } from "./PostImage";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
} from "./Table";
import { UnOrderedList } from "./UnOrderedList";
import { Video } from "./Video";

function LinkIcon() {
	return (
		<LinkSVG
			xmlns="http://www.w3.org/2000/svg"
			width="36"
			height="36"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="feather feather-hash"
		>
			<line x1="4" y1="9" x2="20" y2="9"></line>
			<line x1="4" y1="15" x2="20" y2="15"></line>
			<line x1="10" y1="3" x2="8" y2="21"></line>
			<line x1="16" y1="3" x2="14" y2="21"></line>
		</LinkSVG>
	);
}

function slugify(str: string) {
	return str
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\p{L}\p{N}-]/gu, "");
}

const headers = [H1, H2, H3, H4, H5, H6];

function getHeaderByLevel(level: number) {
	return headers[level - 1] || H1;
}

function getTextContent(node: React.ReactNode): string {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node.map(getTextContent).join(" ");
	}

	if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
		return getTextContent(node.props.children);
	}

	return "";
}

function createHeadingComponent(level: number) {
	const HeadingComponent = ({ children }: { children: React.ReactNode }) => {
		const textContent = getTextContent(children).replace(/\s+/g, " ").trim();
		const slug = slugify(textContent);
		const header = getHeaderByLevel(level);
		return createElement(header, { id: slug }, [
			createElement(LinkAnchor, { href: `#${slug}`, key: `${slug}` }),
			createElement(
				"span",
				{ key: `${slug}-content`, className: "post-heading-titles" },
				children,
			),
		]);
	};

	HeadingComponent.displayName = `HeadingComponent${level}`;
	return HeadingComponent;
}

type CodeProps = {
	className?: string;
	children: React.ReactNode;
};

type PreProps = React.HTMLAttributes<HTMLPreElement> & {
	children: React.ReactNode;
};

function extractCodePropsFromPre(children: React.ReactNode) {
	const [firstChild] = React.Children.toArray(children);

	if (
		!React.isValidElement<{
			className?: string;
			children?: React.ReactNode;
		}>(firstChild)
	) {
		return null;
	}

	return {
		className: firstChild.props.className,
		children: firstChild.props.children,
	};
}

const blockElementTags = new Set([
	"blockquote",
	"div",
	"figure",
	"hr",
	"img",
	"ol",
	"pre",
	"table",
	"ul",
	"video",
]);

function hasBlockChild(children: React.ReactNode): boolean {
	return React.Children.toArray(children).some((child) => {
		if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
			return false;
		}

		if (child.type === React.Fragment) {
			return hasBlockChild(child.props.children);
		}

		if (child.type === PostImage || child.type === Video) {
			return true;
		}

		return typeof child.type === "string" && blockElementTags.has(child.type);
	});
}

const PostArticleComponents = {
	h1: createHeadingComponent(1),
	h2: createHeadingComponent(2),
	h3: createHeadingComponent(3),
	h4: createHeadingComponent(4),
	h5: createHeadingComponent(5),
	h6: createHeadingComponent(6),
	p: ({ children }: { children: React.ReactNode }) => {
		if (hasBlockChild(children)) {
			return <ParagraphFlow>{children}</ParagraphFlow>;
		}

		return <P>{children}</P>;
	},
	img: PostImage,
	Video,
	pre: ({ children, ...props }: PreProps) => {
		const codeProps = extractCodePropsFromPre(children);

		if (codeProps) {
			return <CodeBlock {...props} {...codeProps} />;
		}

		return <Pre {...props}>{children}</Pre>;
	},
	code: ({ className, ...props }: CodeProps) => {
		if (className?.startsWith("language-")) {
			return <CodeBlock className={className} {...props} />;
		}

		return <InlineCode className={className} {...props} />;
	},

	ul: UnOrderedList,
	ol: OrderedList,
	li: ListItem,
	blockquote: Blockquote,
	a: CustomLink,
	hr: HorizontalRule,
	table: Table,
	thead: TableHead,
	tbody: TableBody,
	tr: TableRow,
	th: TableHeaderCell,
	td: TableCell,
	strong: Strong,
	em: Emphasis,
	...MDXComponents,
};

export { PostArticleComponents };
