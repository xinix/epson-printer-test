class EpsonPrinter {
    private readonly address: string
    private readonly timeout: number
    private readonly buffer: string[]

    constructor(config: any) {
        const name = 'local_printer'
        this.timeout = config.timeout ?? 60000
        this.address = `https://${config.ip}/cgi-bin/epos/service.cgi?devid=${name}&timeout=${this.timeout}`
        this.buffer = []
    }

    cut() {
        this.buffer.push(`<cut type="feed"/>`)
    }

    header(
        txt: string | number,
        icon: 'takeout' | 'delivery' | 'latch' | null = null
    ) {
        if (icon != null) {
            this.align('right')
            this.icon(icon)
            this.align('left')
        }
        this.buffer.push(`<text font="font_a"/>`)
        this.buffer.push(`<text dw="true" dh="true" em="true"/>`)
        this.buffer.push(`<text>${txt}&#10;</text>`)
        this.buffer.push(`<text dw="false" dh="false" em="false"/>`)
    }

    feed(numberOfLines = 30) {
        this.buffer.push(`<feed unit="${numberOfLines}"/>`)
    }

    line(thickness: 'thin' | 'medium' | 'thick' = 'thin') {
        this.buffer.push(`<page>`)
        this.buffer.push(`<area x="0" y="0" width="576" height="15"/>`)
        this.buffer.push(
            `<line x1="0" y1="0" x2="575" y2="0" style="${thickness}"/>`
        )
        this.buffer.push(`</page>`)
    }

    badge(txt: string) {
        this.buffer.push(`<text reverse="true"/>`)
        this.buffer.push(`<text>${txt}</text>`)
        this.buffer.push(`<text reverse="false"/>`)
        this.buffer.push(`<text> </text>`)
    }

    text(txt: string) {
        this.buffer.push(`<text font="font_a"/>`)
        this.buffer.push(`<text>${txt}&#10;</text>`)
    }

    font(size: 'sm' | 'md' = 'md') {
        if (size === 'sm') {
            this.buffer.push(`<text font="font_b"/>`)
        } else {
            this.buffer.push(`<text font="font_a"/>`)
        }
    }

    align(align: 'left' | 'center' | 'right') {
        this.buffer.push(`<text align="${align}"/>`)
    }

    row(left: string, right: string, small = false) {
        const total = left.length + right.length
        const max = small ? 64 : 48

        let txt: string
        if (total < max) {
            txt = `${left}${' '.repeat(max - total)}${right}`
        } else {
            const end = max - left.length - 2
            txt = `${left}${' '.repeat(2)}${right.substring(0, end)}`
        }
        this.buffer.push(`<text>${txt}&#10;</text>`)
    }

    foot(left: string, right: string, max: number, bold = false) {
        const padding = 48 - left.length - max
        const txt = `${' '.repeat(padding)}${left}${' '.repeat(
            max - right.length
        )}`
        this.buffer.push(`<text>${txt}</text>`)
        if (bold) {
            this.buffer.push(`<text em="true"/>`)
        }
        this.buffer.push(`<text>${right}&#10;</text>`)
        if (bold) {
            this.buffer.push(`<text em="false"/>`)
        }
    }

    bold(txt: string) {
        this.buffer.push(`<text em="true"/>`)
        this.buffer.push(`<text>${txt}&#10;</text>`)
        this.buffer.push(`<text em="false"/>`)
    }

    spacing(nbr = 30) {
        this.buffer.push(`<text linespc="${nbr}"/>`)
    }

    rowBadge(left: { txt: string; badge: string }, right: string) {
        const total = left.txt.length + left.badge.length + 1 + right.length
        const max = 48

        this.buffer.push(`<text>${left.txt} </text>`)
        this.buffer.push(`<text reverse="true"/>`)
        this.buffer.push(`<text>${left.badge}</text>`)
        this.buffer.push(`<text reverse="false"/>`)

        let txt: string
        if (total < max) {
            txt = `${' '.repeat(max - total)}${right}`
        } else {
            const end = max - left.txt.length + left.badge.length - 1
            txt = `${left}${' '.repeat(2)}${right.substring(0, end)}`
        }
        this.buffer.push(`<text>${txt}&#10;</text>`)
    }

    rowRight(txt: string, bold = false) {
        this.buffer.push(`<text align="right"/>`)
        if (bold) this.buffer.push(`<text em="true"/>`)
        this.buffer.push(`<text>${txt}&#10;</text>`)
        if (bold) this.buffer.push(`<text em="false"/>`)
        this.buffer.push(`<text align="left"/>`)
    }

    newLine() {
        this.buffer.push(`<text>&#10;</text>`)
    }

    icon(method: 'takeout' | 'delivery' | 'latch') {
        if (method === 'takeout') {
            this.buffer.push(
                `<image width="46" height="42" color="color_1" mode="mono">AAAAAAAAAAAAAAAAAf////wAAf////wAAf////wAAf////wAAP////gAAAAAAAAAAUqqqqgAB/////8AB/////8AB/////8AD/////+AD/////+AH//////AH//////AH//////AP//////gP//////gf//////wf//////wf//////w///////4f//////wf//////wB8AH4B8AB8AD4B8AB8AHwB8AB8AD4B8AB8AH4B8AB8ADwB8AB8AH4B8AB8ADwB8AB8AH4B8AB8AD4B8AB///wB8AB///4B8AB///4B8AB///wB8AA///wA4AAAAAAAAAAAAAAAAA</image>`
            )
        } else if (method === 'delivery') {
            this.buffer.push(
                `<image width="46" height="42" color="color_1" mode="mono">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///8AAAD///+AAAH////AAAH////AAAH////AAAH////AAAH////AAAP/////wAH/////8AH/////8AH/////8AH////A+AH////AeAP////AeAH////AfAH////APAH////1fAH//////AH//////AP//////AH//////AH//////AH////f/gH8f/+P/AD8Pt+HqAA8fAePgAA++AffAAA/+Af/AAAf8AP+AAAP4AH8AAACgABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</image>`
            )
        } else if (method === 'latch') {
            this.buffer.push(
                `<image width="43" height="42" color="color_1" mode="mono">AAAAAAAAALbbbYAAAf///+AAAf///+AAAf///+AAAftb++AAAfAB8OAAAeAA8GAAAeAA8OAAAeAA8OAAAeAA8OAAAeAA8OAAAeAA8GAAAfAB8OAAAeAA/+AAAeAA/+AAAeAA/+AAAeAA/+AAAeAA9OAAAfAB8OAAAeAA8OAAAeAA8OAAAeAA/+AAAfAB/+AAAfAB/+AAAf///+AAAf///+AAAf///+AAAf///+AAAfAAf+AAAeAAf+AAAeAAf+AAAeAAf+AAAfrbf+AAAf///+AAAf///+AAAf///+AAAP///8AAADwADwAAADwADwAAABgAAgAAAAAAAAAA</image>`
            )
        }
    }

    print(finish: any) {
        const soap = [
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<s:Body><epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">',
            ...this.buffer,
            '</epos-print></s:Body></s:Envelope>',
        ]

        const xhr = new XMLHttpRequest()
        xhr.open('POST', this.address, true)
        xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8')
        xhr.setRequestHeader(
            'If-Modified-Since',
            'Thu, 01 Jan 1970 00:00:00 GMT'
        )
        xhr.setRequestHeader('SOAPAction', '""')

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                clearTimeout(timer)
                if (xhr.status === 200 && xhr.responseXML) {
                    const doc = xhr.responseXML
                    const response = doc.getElementsByTagName('response')[0]
                    const attr = response.attributes.getNamedItem('success')

                    if (attr == null) {
                        return finish != null ? finish(false) : false
                    }

                    if (finish != null) {
                        finish(attr.value === 'true')
                    }
                }
            }
        }

        const timer = setTimeout(function () {
            xhr.abort()
        }, this.timeout)
        xhr.send(soap.join('\n'))
    }
}

export { EpsonPrinter }
