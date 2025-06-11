"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Github, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function GitHubIntegration() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [step, setStep] = useState(1)
  const [githubUrl, setGithubUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate GitHub connection process
    setTimeout(() => {
      setConnectionStatus("success")
      setIsConnecting(false)
      setStep(3)
    }, 3000)
  }

  const handleComplete = () => {
    router.push(`/projects/${projectId}/workspace?tab=sources`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/projects/${projectId}/workspace`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">Step {step} of 3</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="h-8 w-8 text-gray-800" />
              </div>
              <CardTitle>Connect GitHub Repository</CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Repository URL</h3>
                    <p className="text-gray-600 mb-4">
                      Enter the GitHub repository URL you want to connect to this project.
                    </p>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">What we'll analyze:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Code structure and architecture</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>README and documentation files</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Package dependencies and tech stack</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Issue tracking and project management</span>
                      </li>
                    </ul>
                  </div>

                  <Button onClick={() => setStep(2)} disabled={!githubUrl.trim()} className="w-full">
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Authorize GitHub Access</h3>
                    <p className="text-gray-600 mb-4">
                      We need permission to access your repository. This will redirect you to GitHub for authorization.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Github className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Repository Details</h4>
                          <p className="text-sm text-blue-700 mt-1">{githubUrl}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Permissions needed:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Read repository contents</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Access repository metadata</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Read issues and pull requests</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleConnect} disabled={isConnecting} className="flex-1">
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Github className="h-4 w-4 mr-2" />
                          Authorize GitHub
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div>
                    {connectionStatus === "success" ? (
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    ) : (
                      <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    )}

                    <h3 className="text-lg font-semibold mb-2">
                      {connectionStatus === "success" ? "Successfully Connected!" : "Connection Failed"}
                    </h3>

                    {connectionStatus === "success" ? (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Your GitHub repository has been successfully connected to this project.
                        </p>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Github className="h-5 w-5 text-green-600" />
                              <div className="text-left">
                                <h4 className="font-medium text-green-900">Repository Connected</h4>
                                <p className="text-sm text-green-700">{githubUrl}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                        </div>

                        <div className="text-left">
                          <h4 className="font-medium mb-2">What happens next:</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Repository analysis will begin automatically</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Documentation will be generated based on your code</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>You'll receive notifications when analysis is complete</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          There was an issue connecting to your GitHub repository. Please try again.
                        </p>
                        <Button onClick={() => setStep(2)} variant="outline">
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>

                  {connectionStatus === "success" && (
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on GitHub
                      </Button>
                      <Button onClick={handleComplete} className="flex-1">
                        Continue to Project
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
