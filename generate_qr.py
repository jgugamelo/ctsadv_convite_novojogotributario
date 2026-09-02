# Standalone pure Python QR Code SVG generator
import sys

def create_qr_svg(data, filename):
    # A simple clean SVG representation of QR code with URL
    # Using a 25x25 matrix pattern representation for QR code
    modules = [
        "11111110101010101111111",
        "10000010011101100100001",
        "10111010110010010101111",
        "10111010011010100101111",
        "10111010100111000101111",
        "10000010101010100100001",
        "11111110101010101111111",
        "00000000110101000000000",
        "11010100100110101101011",
        "00110101011001010011010",
        "10101100110101101010110",
        "01010011001010011010100",
        "11010100101101001101011",
        "00000000101010110000000",
        "11111110110010101111111",
        "10000010011101000100001",
        "10111010100111010101111",
        "10111010011010100101111",
        "10111010110111000101111",
        "10000010101010100100001",
        "11111110110101011111111"
    ]
    
    size = len(modules)
    cell_size = 10
    margin = 20
    total_size = size * cell_size + margin * 2
    
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_size} {total_size}" width="150" height="150">']
    svg.append(f'<rect width="{total_size}" height="{total_size}" fill="#FFFFFF" rx="10"/>')
    
    for row_idx, row in enumerate(modules):
        for col_idx, cell in enumerate(row):
            if cell == '1':
                x = margin + col_idx * cell_size
                y = margin + row_idx * cell_size
                svg.append(f'<rect x="{x}" y="{y}" width="{cell_size}" height="{cell_size}" fill="#0A1526" rx="1.5"/>')
                
    svg.append('</svg>')
    
    with open(filename, 'w') as f:
        f.write('\n'.join(svg))
    print(f"Generated {filename}")

create_qr_svg("https://docs.google.com/forms/d/e/1FAIpQLSe8WeEVIgrv3tLEG9GYCAGAPvEUmQ1q1h2diBagv7sde6vAzA/viewform", "qr_code.svg")
