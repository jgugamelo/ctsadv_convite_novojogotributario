import Foundation
import WebKit
import AppKit

if CommandLine.arguments.count < 3 {
    print("Usage: swift render_pdf.swift <htmlPath> <pdfPath>")
    exit(1)
}

let htmlPath = CommandLine.arguments[1]
let pdfPath = CommandLine.arguments[2]

let url = URL(fileURLWithPath: htmlPath)
guard let htmlString = try? String(contentsOf: url, encoding: .utf8) else {
    print("Failed to read HTML file")
    exit(1)
}

class PDFRenderer: NSObject, WKNavigationDelegate {
    let webView: WKWebView
    let pdfPath: String

    init(pdfPath: String) {
        self.pdfPath = pdfPath
        let config = WKWebViewConfiguration()
        // Dimensions for A5: 148mm x 210mm in points (72 points per inch -> 148/25.4*72 = 419.53, 210/25.4*72 = 595.28)
        self.webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 419.53, height: 595.28), configuration: config)
        super.init()
        self.webView.navigationDelegate = self
    }

    func render(html: String, baseURL: URL) {
        webView.loadHTMLString(html, baseURL: baseURL)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Wait briefly for images/fonts to load
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let pdfConfig = WKPDFConfiguration()
            pdfConfig.rect = CGRect(x: 0, y: 0, width: 419.53, height: 595.28)

            self.webView.createPDF(configuration: pdfConfig) { result in
                switch result {
                case .success(let data):
                    do {
                        try data.write(to: URL(fileURLWithPath: self.pdfPath))
                        print("SUCCESS: PDF generated at \(self.pdfPath)")
                        exit(0)
                    } catch {
                        print("Error writing PDF data: \(error)")
                        exit(1)
                    }
                case .failure(let error):
                    print("Error creating PDF: \(error)")
                    exit(1)
                }
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("WebView failed navigation: \(error)")
        exit(1)
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let renderer = PDFRenderer(pdfPath: pdfPath)
renderer.render(html: htmlString, baseURL: url.deletingLastPathComponent())

// Timeout safety loop
DispatchQueue.main.asyncAfter(deadline: .now() + 8.0) {
    print("Timeout waiting for WebKit")
    exit(1)
}

app.run()
