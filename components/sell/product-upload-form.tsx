"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, DollarSign, Package, ImageIcon, Loader2, CheckCircle } from "lucide-react"
import { categories } from "@/lib/products"
import { useRouter } from "next/navigation"
import { ECommerceABI, ECommerceAddress } from "@/lib/abi/ecommerce-abi"
import { USDTtoAVAX } from "@/lib/utils"
import { FileUploadWithPreview } from "../file-upload-with-preview"
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react"
import { client } from "@/contexts/thirdwebclient"
import { avalancheFuji } from "thirdweb/chains"
import { getContract, prepareContractCall, PreparedTransaction } from "thirdweb"

interface ProductFormData {
  name: string
  description: string
  price: string
  priceUSD: string
  category: string
  condition: string //"new" | "used" | "refurbished" | ""
  imageUri: string
  tags: string[]
}

export function ProductUploadForm() {

  const account = useActiveAccount();
  const address = account?.address;

  // console.log(SellerData);
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    priceUSD: "",
    category: "",
    condition: "",
    imageUri: "",
    tags: [],
  })

  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
      }
      if (field === "imageUri"){
          console.log(value)
      }
  };


  const steps = [
    { number: 1, title: "Basic Info", description: "Product name and description" },
    { number: 2, title: "Category & Condition", description: "Categorize your product" },
    { number: 3, title: "Pricing", description: "Set your price" },
    { number: 4, title: "Images & Tags", description: "Add photos and tags" },
    { number: 5, title: "Review", description: "Review and publish" },
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ProductFormData> = {}

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Product name is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (formData.description.length < 20) newErrors.description = "Description must be at least 20 characters"
        break
      case 2:
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.condition) newErrors.condition = "Condition is required"
        break
      case 3:
        // if (!formData.price.trim()) newErrors.price = "AVAX price is required"
        if (!formData.priceUSD.trim()) newErrors.priceUSD = "USD price is required"
        // if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        //   newErrors.price = "Enter a valid AVAX amount"
        // }
        if (isNaN(Number(formData.priceUSD)) || Number(formData.priceUSD) <= 0) {
          newErrors.priceUSD = "Enter a valid USD amount"
        }
        break
      case 4:
        if (formData.imageUri.length === 0) newErrors.imageUri = "At least one image is required";
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const contract = getContract({
      client: client,
      chain: avalancheFuji,
      address: ECommerceAddress
  });
  console.log(contract);

  const { data: sellerDetails, isLoading } = useReadContract({
    contract,
    method:  "function sellers(address) view returns (string name, string profileURI, uint256 confirmedPurchases, uint256 canceledPurchases, uint256 reportedPurchases, uint256 rating)",
    params: [address!]
  })
  console.log(sellerDetails)

  const { push } = useRouter();
  const { mutateAsync: listProduct, isPending, isSuccess: sendTxSuccessful, isError } = useSendTransaction();

  const transaction = useMemo(() => {
    if (!contract || currentStep !== 5) return;
    if (!formData.name || !formData.description || !formData.imageUri || !formData.priceUSD) {
      return null;
    }

    const call = prepareContractCall({
      contract,
      method: "function createProduct(string memory _name, string memory _imageUrl, uint _price, string memory _description, uint _inventory) public",
      params: [formData.name, formData.imageUri, BigInt(Math.floor(parseFloat(formData.priceUSD))), formData.description, BigInt(10)]
    })
    return call
  }, [formData.name, formData.description, formData.imageUri, formData.priceUSD, currentStep])

  const handleListProduct = async () => {
    console.log("Starting... ")

    if (!transaction) {
      console.error("Transaction is not ready. Missing required fields or contract not loaded.");
      return;
    }

    // Additional validation
    if (!validateStep(5)) {
      console.error("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    try {
      let txHash = await listProduct(transaction as PreparedTransaction);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/products")
      }, 3000)
      console.log(txHash);
    } catch (err) {
      console.error("Failed to create product: ", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-premium-gradient flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-gray-800 p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Product Listed Successfully!</h2>
          <p className="text-gray-300 mb-6">
            Your product "{formData.name}" has been added to the marketplace. Redirecting you to browse products...
          </p>
          <div className="animate-spin h-6 w-6 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-premium-gradient">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Sell Your Product</h1>
          <p className="text-xl text-gray-300">
            List your item on the decentralized marketplace with escrow protection
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-yellow-500 border-yellow-500 text-black"
                      : "border-gray-600 text-gray-400"
                  }`}
                >
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${currentStep > step.number ? "bg-yellow-500" : "bg-gray-600"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-white">{steps[currentStep - 1].title}</h3>
            <p className="text-gray-400">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="bg-gray-900/50 border-gray-800 p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your product name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-white mb-2 block">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product in detail..."
                  className="bg-gray-800 border-gray-700 text-white min-h-32"
                  rows={6}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
                  <p className="text-gray-400 text-sm">{formData.description.length}/500 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category & Condition */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-white mb-4 block">Category *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category, index) => (
                    <Card
                      key={`${category.id}-${index}`}
                      className={`p-4 text-center cursor-pointer transition-all ${
                        formData.category === category.id
                          ? "bg-yellow-500/20 border-yellow-500"
                          : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, category: category.id }))}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <h3 className="text-sm font-medium text-white">{category.name}</h3>
                    </Card>
                  ))}
                </div>
                {errors.category && <p className="text-red-400 text-sm mt-2">{errors.category}</p>}
              </div>

              <div>
                <Label className="text-white mb-2 block">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value as any }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-red-400 text-sm mt-1">{errors.condition}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="priceUSD" className="text-white mb-2 block">
                    Price in USD *
                  </Label>
                  <div className="relative">
                    <Input
                      id="priceUSD"
                      type="number"
                      step="0.01"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priceUSD: e.target.value }))}
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                  </div>
                  {errors.priceUSD && <p className="text-red-400 text-sm mt-1">{errors.priceUSD}</p>}
                </div>

                <div>
                  <Label htmlFor="price" className="text-white mb-2 block">
                    Price in AVAX *
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={USDTtoAVAX(parseFloat(formData.priceUSD)).toFixed(3)}
                      readOnly={true}
                      // onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold">
                      ⟐
                    </div>
                  </div>
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>
              </div>

              <Card className="bg-blue-500/10 border-blue-500/20 p-4">
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Pricing Tips</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Research similar products to set competitive prices</li>
                      <li>• Consider the condition and rarity of your item</li>
                      <li>• Remember that buyers pay gas fees on top of your price</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 4: Images & Tags */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-white mb-4 block">Product Image *</Label>

                {/* Image Upload Area */}
                {/* <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Click to upload images</p>
                    <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB each</p>
                  </label>
                </div>

                {/* Image Preview *
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )} */}
                <FileUploadWithPreview
                  label="Product Image"
                  id="imageUri"
                  value={formData.imageUri}
                  onChange={(uri, filename) => {
                    handleInputChange("imageUri", uri);
                  }}
                  error={errors.imageUri}
                  required={true}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  setPreviewUrl={setPreviewUrl}
                />
                {errors.imageUri && <p className="text-red-400 text-sm mt-2">{errors.imageUri}</p>}
              </div>

              <div>
                <Label className="text-white mb-2 block">Tags (Optional)</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="bg-gray-800 border-gray-700 text-white"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} disabled={!newTag.trim() || formData.tags.length >= 10}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      >
                        {tag}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-2">{formData.tags.length}/10 tags</p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Review Your Listing</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Preview */}
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  {formData.imageUri && (
                    <img
                      src={previewUrl}
                      alt={formData.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-500 text-black">
                        {categories.find((c) => c.id === formData.category)?.name}
                      </Badge>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        {formData.condition}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{formData.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{formData.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-yellow-400">{formData.price} AVAX</span>
                        <div className="text-xs text-gray-500">${formData.priceUSD}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Details Summary */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">Product Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white">{categories.find((c) => c.id === formData.category)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Condition:</span>
                        <span className="text-white capitalize">{formData.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white">
                          {formData.price} AVAX (${formData.priceUSD})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Images:</span>
                        <span className="text-white">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tags:</span>
                        <span className="text-white">{formData.tags.length}</span>
                      </div>
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <Separator className="my-8 bg-gray-700" />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-gray-600 text-gray-300 bg-transparent"
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext} className="bg-yellow-500 text-black hover:bg-yellow-600">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleListProduct}
                disabled={isSubmitting}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Product"
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
