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


## Section 7: a listing taller than a page

A code block that is taller than one page cannot be kept together, so it starts right after its heading and continues on the next page.

```python
def pipeline(data):
    step_1 = transform(data, option=1)  # processing step number 1
    step_2 = transform(data, option=2)  # processing step number 2
    step_3 = transform(data, option=3)  # processing step number 3
    step_4 = transform(data, option=4)  # processing step number 4
    step_5 = transform(data, option=5)  # processing step number 5
    step_6 = transform(data, option=6)  # processing step number 6
    step_7 = transform(data, option=7)  # processing step number 7
    step_8 = transform(data, option=8)  # processing step number 8
    step_9 = transform(data, option=9)  # processing step number 9
    step_10 = transform(data, option=10)  # processing step number 10
    step_11 = transform(data, option=11)  # processing step number 11
    step_12 = transform(data, option=12)  # processing step number 12
    step_13 = transform(data, option=13)  # processing step number 13
    step_14 = transform(data, option=14)  # processing step number 14
    step_15 = transform(data, option=15)  # processing step number 15
    step_16 = transform(data, option=16)  # processing step number 16
    step_17 = transform(data, option=17)  # processing step number 17
    step_18 = transform(data, option=18)  # processing step number 18
    step_19 = transform(data, option=19)  # processing step number 19
    step_20 = transform(data, option=20)  # processing step number 20
    step_21 = transform(data, option=21)  # processing step number 21
    step_22 = transform(data, option=22)  # processing step number 22
    step_23 = transform(data, option=23)  # processing step number 23
    step_24 = transform(data, option=24)  # processing step number 24
    step_25 = transform(data, option=25)  # processing step number 25
    step_26 = transform(data, option=26)  # processing step number 26
    step_27 = transform(data, option=27)  # processing step number 27
    step_28 = transform(data, option=28)  # processing step number 28
    step_29 = transform(data, option=29)  # processing step number 29
    step_30 = transform(data, option=30)  # processing step number 30
    step_31 = transform(data, option=31)  # processing step number 31
    step_32 = transform(data, option=32)  # processing step number 32
    step_33 = transform(data, option=33)  # processing step number 33
    step_34 = transform(data, option=34)  # processing step number 34
    step_35 = transform(data, option=35)  # processing step number 35
    step_36 = transform(data, option=36)  # processing step number 36
    step_37 = transform(data, option=37)  # processing step number 37
    step_38 = transform(data, option=38)  # processing step number 38
    step_39 = transform(data, option=39)  # processing step number 39
    step_40 = transform(data, option=40)  # processing step number 40
    step_41 = transform(data, option=41)  # processing step number 41
    step_42 = transform(data, option=42)  # processing step number 42
    step_43 = transform(data, option=43)  # processing step number 43
    step_44 = transform(data, option=44)  # processing step number 44
    step_45 = transform(data, option=45)  # processing step number 45
    step_46 = transform(data, option=46)  # processing step number 46
    step_47 = transform(data, option=47)  # processing step number 47
    step_48 = transform(data, option=48)  # processing step number 48
    step_49 = transform(data, option=49)  # processing step number 49
    step_50 = transform(data, option=50)  # processing step number 50
    step_51 = transform(data, option=51)  # processing step number 51
    step_52 = transform(data, option=52)  # processing step number 52
    step_53 = transform(data, option=53)  # processing step number 53
    step_54 = transform(data, option=54)  # processing step number 54
    step_55 = transform(data, option=55)  # processing step number 55
    step_56 = transform(data, option=56)  # processing step number 56
    step_57 = transform(data, option=57)  # processing step number 57
    step_58 = transform(data, option=58)  # processing step number 58
    step_59 = transform(data, option=59)  # processing step number 59
    step_60 = transform(data, option=60)  # processing step number 60
    return data
```

Text after the long listing continues normally.
