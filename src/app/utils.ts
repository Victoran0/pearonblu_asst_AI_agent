export const capitalizeUsername = (username: string): string => {
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

export const formattedResponse = (text: string): string => {
        // because html does not automatically intrepet \n as line or paragraph spacing we use this function
        const formattedText = text.split('\n\n').map((paragraph) => // split the text by \n\n to get paragraphs
            paragraph.split("\n") // split each paragraphs by \n to get each line
            .map(line => line.trim()) // remove whitespaces on either end of the lines
            .join('<br />') // join the splitted line of each paragraphs by html line breaks
        )
        .map(paragraph => `<p>${paragraph}</p>`) // transform each splitted paragraph into html paragraphs
        .join("") // join then to form html paragraphed and line breaks texts
        return formattedText 
    }