# PDF export example

This file shows how MD File Editor exports a document to PDF. Open it, choose Export to PDF, and compare with `pdf-export-sample.pdf` in this folder.

It includes the things that used to break badly at page boundaries: headings followed by code, tables, quotes, and long code lines.

## Section 1: example block

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

```python
def moving_average(values, window=3):
    # Average each value with the previous (window - 1) values
    result = []
    for i in range(len(values)):
        start = max(0, i - window + 1)
        chunk = values[start:i + 1]
        result.append(sum(chunk) / len(chunk))
    return result

# A long line to show that code wraps in the PDF instead of running off the page edge
message = 'This is a deliberately long string literal that keeps going so the printed page has to wrap the line: ' + 'x' * 40
```

## Section 2: example block

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

| Feature | Behavior in the PDF |
|---|---|
| Headings | Stay with the text that follows |
| Code blocks | Not split when they fit on one page |
| Tables | Rows are not cut in half |
| Long code lines | Wrap inside the page margins |

## Section 3: example block

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

```python
def moving_average(values, window=3):
    # Average each value with the previous (window - 1) values
    result = []
    for i in range(len(values)):
        start = max(0, i - window + 1)
        chunk = values[start:i + 1]
        result.append(sum(chunk) / len(chunk))
    return result

# A long line to show that code wraps in the PDF instead of running off the page edge
message = 'This is a deliberately long string literal that keeps going so the printed page has to wrap the line: ' + 'x' * 40
```

> A block quote is also kept together instead of being split across two pages.

Math renders too: $E = mc^2$

## Section 4: example block

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

| Feature | Behavior in the PDF |
|---|---|
| Headings | Stay with the text that follows |
| Code blocks | Not split when they fit on one page |
| Tables | Rows are not cut in half |
| Long code lines | Wrap inside the page margins |

## Section 5: example block

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

```python
def moving_average(values, window=3):
    # Average each value with the previous (window - 1) values
    result = []
    for i in range(len(values)):
        start = max(0, i - window + 1)
        chunk = values[start:i + 1]
        result.append(sum(chunk) / len(chunk))
    return result

# A long line to show that code wraps in the PDF instead of running off the page edge
message = 'This is a deliberately long string literal that keeps going so the printed page has to wrap the line: ' + 'x' * 40
```

## Section 6: example block

Markdown keeps notes readable as plain text and still renders into clean documents. This paragraph is filler that gives the page some body so the page breaks land in realistic places for the export demo.

Exported PDFs are produced by Chromium, which picks the page breaks. The print stylesheet tells it to keep headings with the content that follows and not to split small blocks across pages.

| Feature | Behavior in the PDF |
|---|---|
| Headings | Stay with the text that follows |
| Code blocks | Not split when they fit on one page |
| Tables | Rows are not cut in half |
| Long code lines | Wrap inside the page margins |
