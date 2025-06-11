import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, FileText, Palette, Users, Bot, Star, Check, ArrowRight, Play } from "lucide-react"
import NextLink from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold gradient-text">ProVibe</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">
              Pricing
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-900">
              About
            </a>
            <Button variant="ghost">Login</Button>
            <NextLink href="/dashboard">
              <Button>Get Started</Button>
            </NextLink>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Transform Ideas into <span className="gradient-text">Build-Ready Documentation</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            AI-powered conversational platform that turns product concepts into comprehensive specs, user stories, and
            marketing content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <NextLink href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </NextLink>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl border p-4">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="ProVibe Dashboard Preview"
                width={800}
                height={400}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Persistent AI Intelligence</h3>
              <p className="text-slate-600">Builds understanding over time, remembers every detail</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrated Workflow</h3>
              <p className="text-slate-600">From idea to documentation to code in one platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Anywhere</h3>
              <p className="text-slate-600">Push to Notion, GitHub, V0, and 20+ other tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Everything you need to build better products</h2>
            <p className="text-xl text-slate-600">
              Powerful features that streamline your entire product development process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <MessageCircle className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conversational Interface</h3>
                <p className="text-slate-600">
                  Natural chat builds product knowledge and generates documentation automatically
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Documentation</h3>
                <p className="text-slate-600">
                  Auto-generate PRDs, technical specs, user stories, and API documentation
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Palette className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Marketing Content</h3>
                <p className="text-slate-600">Generate landing pages, ad copy, social media content, and more</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <ArrowRight className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Universal Export</h3>
                <p className="text-slate-600">Seamless integration with Notion, GitHub, Linear, Figma, and more</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-slate-600">Real-time editing, comments, and feedback with your entire team</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Bot className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Agents</h3>
                <p className="text-slate-600">
                  Specialized agents for research, content creation, and growth optimization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <p className="text-slate-600 mb-8">Trusted by innovative teams worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">TechCorp</div>
              <div className="text-2xl font-bold">InnovateLab</div>
              <div className="text-2xl font-bold">BuildFast</div>
              <div className="text-2xl font-bold">DevTeam</div>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto p-8">
            <CardContent className="p-0">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-slate-700 mb-4">
                "ProVibe cut our documentation time by 80%. Now we spend time building, not writing specs."
              </blockquote>
              <cite className="text-slate-600">— Sarah Chen, CTO at TechCorp</cite>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-600">Choose the plan that fits your team's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 relative">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-4">
                  $0<span className="text-lg text-slate-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />3 projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Basic AI
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Core exports
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Community support
                  </li>
                </ul>
                <NextLink href="/dashboard">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </NextLink>
              </CardContent>
            </Card>

            <Card className="p-8 relative border-indigo-200 shadow-lg">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">Most Popular</Badge>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $49<span className="text-lg text-slate-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Advanced AI
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    All integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Team collaboration
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Priority support
                  </li>
                </ul>
                <NextLink href="/dashboard">
                  <Button className="w-full">Start Free Trial</Button>
                </NextLink>
              </CardContent>
            </Card>

            <Card className="p-8 relative">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-4">Custom</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Custom agents
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    SSO integration
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Advanced security
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    Custom integrations
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold">ProVibe</span>
              </div>
              <p className="text-slate-400">Transform ideas into build-ready documentation with AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ProVibe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
