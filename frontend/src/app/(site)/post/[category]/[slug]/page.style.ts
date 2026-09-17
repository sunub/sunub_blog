import styled, { keyframes } from "styled-components";

const slideInAnimation = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Main = styled.main`
  background-color: var(--color-background);
  font-weight: 300;
`;

export const ArticleRootWrapper = styled.div`
  max-width: 60rem;
  width: 100cqw;

  margin-left: auto;
  margin-right: auto;
`;

export const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 100cqw;

  margin-left: auto;
  margin-right: auto;
  padding: 4rem 3rem;
  gap: 1.25rem;
`;

export const PostTitle = styled.h1`
  max-width: 18ch;
  color: var(--color-text);
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.05em;
  text-wrap: pretty;

  animation: ${slideInAnimation} 0.5s ease-out forwards;
  will-change: transform, opacity;
`;

export const HeaderEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-height: 2rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-highlight) 12%, transparent);
  color: var(--color-highlight);
  padding: 0.35rem 0.85rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  animation: ${slideInAnimation} 0.5s ease-out forwards;
  will-change: transform, opacity;
`;

export const HeaderSummary = styled.p`
  max-width: 44rem;
  color: color-mix(in oklch, var(--color-text) 62%, transparent);
  font-size: clamp(1.05rem, 1vw + 0.9rem, 1.28rem);
  line-height: 1.72;
  text-wrap: pretty;

  & > code {
    margin: 0;
  }

  animation: ${slideInAnimation} 0.5s ease-out forwards;
  will-change: transform, opacity;
`;

export const HeaderMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1rem;

  animation: ${slideInAnimation} 0.5s ease-out forwards;
  will-change: transform, opacity;
`;

export const Time = styled.time`
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0 0.85rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-text) 6%, transparent);
  color: color-mix(in oklch, var(--color-text) 72%, transparent);
  font-size: 0.86rem;
  font-weight: 700;

  animation: ${slideInAnimation} 0.5s ease-out forwards;
  will-change: transform, opacity;
`;

export const HeaderTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const HeaderTag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  border: 1px solid color-mix(in oklch, var(--color-highlight) 32%, transparent);
  background: color-mix(in oklch, var(--color-highlight) 8%, transparent);
  color: var(--color-highlight);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const ArticleWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  gap: 2.25rem;
`;

export const Article = styled.article`
  width: 100%;
  height: 100%;

  max-width: 850px;
  font-size: 18px;
  line-height: 1.72;
  padding-top: 0.75rem;
  padding-bottom: 4rem;
  border-top: 1px solid color-mix(in oklch, var(--color-highlight) 14%, transparent);

  & > h2:first-child,
  & > h3:first-child,
  & > p:first-child {
    margin-top: 0;
  }

  & > h2 + h3 {
    margin-top: 1rem;
  }

  & > p + ul,
  & > p + ol,
  & > p + blockquote,
  & > p + table,
  & > p + pre {
    margin-top: 1rem;
  }
`;
