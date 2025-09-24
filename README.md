# Scale AI - PM Case Study

This repo contains my prototype for the Scale AI take-home assignment. This UX shows a hypothetical insurance claims agent workflow tool and shows how AI can be used to assist the claims agent in processing tasks and claims efficiently.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Run Locally
```bash
npm install
npm start
```
Navigate to `http://localhost:8080`

## 📋 Development Process & Tools Used

1. Work through core user journey and user stories (see [design doc](https://docs.google.com/document/d/1aBAlycmtJP4GJ_r2mEfsx2clJXPsl-OE4oFDI-Wf8WE/edit?tab=t.0))
2. Mock up UX and layout with basic components (see image below)
3. Pass user stories and photo of UX layout into Replit Agent
4. Continue development in Claude Code

![Scale Drawing](https://github.com/user-attachments/assets/3528b384-03d1-4f6f-a416-f945e032efcd)

## 🎯 Key Features Implemented

### Dual User Interface
- **Claims Agent View**: Review and approve claims with AI assistance
- **Senior Adjuster View**: Assign approved claims to repair shops

### Core Capabilities
- **AI Damage Analysis**: Automated damage categorization with confidence scoring
- **Interactive Photo Viewer**: Category-based photo organization with damage highlighting
- **Cost Estimation**: AI-generated repair estimates with manual override capabilities
- **Audit Trail**: Complete workflow tracking and compliance
- **Repair Shop Selection**: Intelligent shop matching and assignment workflow

### Interactive Features
- **Damage Area Adjustment**: Draw and modify damage areas on photos
- **Real-time Updates**: Live status changes and sidebar updates
- **Multi-claim Dashboard**: Priority-based claim organization
- **Role-based Navigation**: Dynamic interface based on user permissions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** components with Tailwind CSS
- **TanStack Query** for state management and API calls
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** (PostgreSQL/Neon ready)
- **RESTful API** design
- **Audit logging** system

## 🎯 User Workflows

### Claims Agent Workflow
1. **Review Active Claims**: View pending claims with AI analysis
2. **Analyze Damage**: Review AI-highlighted damage areas
3. **Adjust Estimates**: Modify repair costs and damage areas
4. **Approve Claims**: Send approved claims to senior adjusters

### Senior Adjuster Workflow
1. **Review Approved Claims**: View claims waiting for shop assignment
2. **Select Repair Shop**: Choose from qualified repair shops
3. **Add Instructions**: Include special notes for repair shops
4. **Send to Shop**: Finalize shop assignment and update claim status

## 📊 Success Metrics

The application tracks key performance indicators:

- **Claims agent adoption**: Target >85% AI estimate acceptance rate
- **Processing time reduction**: Target >50% reduction in review time
- **Auto-approval rate**: Target >60% claims with minimal human review
- **Agent confidence**: High trust in AI recommendations

## 🔮 Future Enhancements

- Create the "batch approve" feature for high confidence claims
- Real AI damage detection integration
- Advanced analytics and reporting
- Mobile responsive optimization

## 📄 Assignment Context

This is a Scale AI take-home assignment demonstrating:
- Product vision and rapid prototyping
- AI-human collaboration workflows
- Modern web development practices
- Clear technical documentation
