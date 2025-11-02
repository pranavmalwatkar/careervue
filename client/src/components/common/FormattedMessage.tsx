import React from 'react';

interface FormattedMessageProps {
	text: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text }) => {
	return (
		<div className="whitespace-pre-line">
			{text.split('\n').map((line, idx) => {
				// Check if line is a heading (starts with **)
				if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
					const headingText = line.trim().slice(2, -2);
					return (
						<div key={idx} className="font-bold mt-2 mb-1 first:mt-0">
							{headingText}
						</div>
					);
				}
				// Check if line is a bullet point
				else if (line.trim().startsWith('•')) {
					return (
						<div key={idx} className="ml-2 my-0.5">
							{line.trim()}
						</div>
					);
				}
				// Regular text
				else if (line.trim()) {
					return (
						<div key={idx} className="my-1">
							{line}
						</div>
					);
				}
				// Empty line for spacing
				return <div key={idx} className="h-1"></div>;
			})}
		</div>
	);
};
