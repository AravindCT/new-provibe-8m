"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, BookOpen, Video, MessageCircle, Mail, ExternalLink, Play, Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const quickStart = [
    {
      title: "Create Your First Project",
      description: "Learn how to set up a new project and start generating documentation",
      duration: "5 min",
      link: "/help/getting-started/first-project",
    },
    {
      title: "Understanding AI Assistance",
      description: "Discover how to effectively communicate with the AI assistant",
      duration: "8 min",
      link: "/help/getting-started/ai-assistance",
    },
    {
      title: "Document Generation",
      description: "Master the art of generating professional documentation",
      duration: "10 min",
      link: "/help/getting-started/document-generation",
    },
    {
      title: "Team Collaboration",
      description: "Set up your team and collaborate on projects",
      duration: "7 min",
      link: "/help/getting-started/collaboration",
    },
  ]

  const videoTutorials = [
    {
      id: "1",
      title: "ProVibe Overview - Getting Started",
      description: "Complete walkthrough of ProVibe's main features and capabilities",
      duration: "12:34",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail",
      views: "2.1k",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Advanced Document Generation Techniques",
      description: "Learn advanced prompting techniques for better AI-generated content",
      duration: "18:45",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail",
      views: "1.5k",
      rating: 4.9,
    },
    {
      id: "3",
      title: "GitHub Integration Deep Dive",
      description: "Complete guide to connecting and analyzing GitHub repositories",
      duration: "15:22",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail",
      views: "987",
      rating: 4.7,
    },
  ]

  const faqs = [
    {
      question: "How does ProVibe's AI generate documentation?",
      answer:
        "ProVibe uses advanced language models trained on millions of technical documents. When you provide project details, requirements, or connect data sources like GitHub repositories, our AI analyzes the information and generates comprehensive, professional documentation tailored to your specific needs.",
    },
    {
      question: "Can I customize the generated documents?",
      answer:
        "All generated documents are fully editable. You can modify content, add sections, change formatting, and even create custom templates. The AI-generated content serves as a strong foundation that you can build upon.",
    },
    {
      question: "What types of documents can ProVibe generate?",
      answer:
        "ProVibe can generate various types of technical documentation including Product Requirements Documents (PRDs), Technical Specifications, User Stories, API Documentation, Design Documents, and more. We're constantly adding new document types based on user feedback.",
    },
    {
      question: "How secure is my project data?",
      answer:
        "Security is our top priority. All data is encrypted in transit and at rest. We follow SOC 2 Type II compliance standards and never use your project data to train our models. You maintain full ownership and control of your content.",
    },
    {
      question: "Can I export documents to other tools?",
      answer:
        "Yes! ProVibe supports exporting to popular tools like Notion, Confluence, Linear, GitHub, and more. You can also download documents in various formats including Markdown, PDF, and DOCX.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free plan includes 3 projects, basic AI assistance, standard templates, and exports to common formats. It's perfect for individual users or small teams getting started with AI-powered documentation.",
    },
    {
      question: "How do I invite team members to my project?",
      answer:
        "You can invite team members from the project settings page. Simply enter their email addresses and assign appropriate roles (Viewer, Editor, or Admin). Team members will receive an invitation email to join your project.",
    },
    {
      question: "Can I use ProVibe offline?",
      answer:
        "ProVibe is a cloud-based platform that requires an internet connection for AI generation and real-time collaboration. However, you can download generated documents for offline viewing and editing.",
    },
  ]

  const categories = [
    { name: "Getting Started", count: 12, icon: "🚀" },
    { name: "Document Generation", count: 8, icon: "📝" },
    { name: "Team Collaboration", count: 6, icon: "👥" },
    { name: "Integrations", count: 10, icon: "🔗" },
    { name: "Account & Billing", count: 5, icon: "💳" },
    { name: "Troubleshooting", count: 7, icon: "🔧" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold gradient-text">ProVibe</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/projects" className="text-slate-600 hover:text-slate-900">
                Projects
              </Link>
              <Link href="/templates" className="text-slate-600 hover:text-slate-900">
                Templates
              </Link>
              <span className="text-indigo-600 font-medium">Help</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">How can we help you?</h1>
          <p className="text-xl text-slate-600 mb-8">Find answers, learn new skills, and get the most out of ProVibe</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-8">
            {/* Quick Start Guide */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Start Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickStart.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold">
                          {index + 1}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-slate-600 mb-4">{item.description}</p>
                      <Button variant="ghost" className="p-0 h-auto text-indigo-600">
                        Start learning
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-slate-600">{category.count} articles</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Video Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-slate-800 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <Video className="h-3 w-3" />
                          <span>{video.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{video.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Documentation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-indigo-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">API Reference</h3>
                    <p className="text-slate-600 mb-4">Complete API documentation for developers</p>
                    <Button variant="ghost" className="p-0 h-auto text-indigo-600">
                      View Documentation
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">User Guide</h3>
                    <p className="text-slate-600 mb-4">Comprehensive guide for all ProVibe features</p>
                    <Button variant="ghost" className="p-0 h-auto text-green-600">
                      Read Guide
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <BookOpen className="h-8 w-8 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Best Practices</h3>
                    <p className="text-slate-600 mb-4">Tips and tricks for optimal results</p>
                    <Button variant="ghost" className="p-0 h-auto text-purple-600">
                      Learn More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-slate-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-slate-600 mb-6">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
