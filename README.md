# Mashti Cafe Website

A modern, responsive website for Mashti Cafe - The First Iranian Juice and Ice Cream Bar in British Columbia.

## 🏪 About Mashti Cafe

Mashti Cafe brings authentic Persian flavors to Vancouver with premium juices, traditional ice cream, and specialty coffee drinks. Our website showcases the unique blend of Iranian heritage and contemporary cafe culture.

## ✨ Features

- **Modern Design**: Beautiful gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Persian/Arabic Support**: Proper RTL text support for Persian content
- **Interactive Elements**: Smooth animations and hover effects
- **Component-Based**: Modular React components for easy maintenance
- **SEO Optimized**: Proper metadata and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Fonts**: Geist Sans (Google Fonts)
- **Deployment**: Ready for Vercel deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mashti-cafe
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
mashti-cafe/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Homepage component
│   │   └── globals.css         # Global styles and animations
│   └── components/
│       ├── Navigation.tsx      # Navigation component with mobile menu
│       └── MenuItem.tsx        # Reusable menu item component
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## 🎨 Design Features

### Color Scheme

- **Primary**: Red (#dc2626) - Represents energy and passion
- **Secondary**: Blue (#1e40af) - Trust and reliability
- **Accent**: Orange (#f59e0b) - Warmth and hospitality
- **Background**: Blue-purple gradient - Modern and vibrant

### Typography

- **English**: Geist Sans - Clean and modern
- **Persian**: Tahoma - Proper RTL support
- **Hierarchy**: Clear typography scale for readability

### Animations

- **Fade In Up**: Smooth entrance animations
- **Pulse Glow**: Subtle logo animation
- **Hover Effects**: Interactive feedback on buttons and cards

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Adding New Menu Items

Edit the `menuItems` array in `src/app/page.tsx`:

```typescript
const menuItems = [
  {
    icon: "🥤",
    title: "Fresh Juices",
    items: ["Pomegranate Juice", "Orange & Carrot"],
    bgColor: "bg-orange-500",
  },
  // Add more items...
];
```

### Updating Colors

Modify CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: #dc2626;
  --secondary: #1e40af;
  --accent: #f59e0b;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

Build the project:

```bash
npm run build
```

The built files will be in the `.next` directory.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact

For questions about this website or Mashti Cafe:

- Email: info@mashticafe.com
- Phone: (604) 555-0123

---

**Mashti Cafe** - The First Iranian Juice and Ice Cream Bar in B.C. 🥤🍦☕
