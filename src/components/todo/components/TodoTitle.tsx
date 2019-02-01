import React from 'react';
import { parseInlineMarkdown } from './../../../utility/markdownHelper';
import './TodoTitle.scss';

type Props = {
    title: string;
};

const TodoTitle = ({ title }: Props) => {
    const innerHtml = { __html: parseInlineMarkdown(title) };

    return <span className="todo--title" dangerouslySetInnerHTML={innerHtml} />;
};

export default TodoTitle;
