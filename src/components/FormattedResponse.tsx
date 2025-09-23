interface FormattedResponseProps {
  content: string;
}

const FormattedResponse = ({ content }: FormattedResponseProps) => {
  // Split content into lines and format them
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        elements.push(<br key={`br-${index}`} />);
        return;
      }
      
      // Headers
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="font-semibold text-base mt-3 mb-2 text-foreground">
            {trimmedLine.replace('## ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h2 key={index} className="font-bold text-lg mt-4 mb-2 text-foreground">
            {trimmedLine.replace('# ', '')}
          </h2>
        );
      }
      // Lists
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc list-inside mb-1">
            {trimmedLine.replace(/^[- •] /, '')}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        elements.push(
          <li key={index} className="ml-4 list-decimal list-inside mb-1">
            {trimmedLine.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      // Bold text
      else if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        const formatted = parts.map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
        );
        elements.push(
          <p key={index} className="mb-2">
            {formatted}
          </p>
        );
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={index} className="mb-2">
            {trimmedLine}
          </p>
        );
      }
    });
    
    return elements;
  };

  return <div>{formatContent(content)}</div>;
};

export default FormattedResponse;