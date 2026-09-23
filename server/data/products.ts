import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    sku: "DZ-ELEC-SAM-S25-512",
    title: "Samsung Galaxy S25 Ultra 5G (512GB / 12GB RAM)",
    slug: "samsung-galaxy-s25-ultra-5g-512gb",
    brand: "Samsung",
    category: "Electronics",
    subCategory: "Smartphones",
    price: 389999,
    compareAtPrice: 429999,
    currency: "PKR",
    discountPercentage: 9.3,
    stock: 45,
    rating: 4.88,
    ratingCount: 312,
    isAvailable: true,
    isFeatured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["flagship", "5g", "amoled", "daraz-mall", "official-warranty"],

    // Heavy overfetching payload
    descriptionHtml: "<div class='product-desc'><h2>Next Generation AI Smartphone</h2><p>Experience unprecedented speed with Snapdragon 8 Elite, quad-telephoto optical zoom, and titanium chassis built for endurance in South Asian climates.</p><ul><li>Dynamic AMOLED 2X 120Hz display with 2600 nits peak brightness</li><li>Integrated S-Pen stylus with ultra-low 2.8ms latency</li><li>Knox Vault security certification for financial grade protection</li></ul></div>",
    rawMarkdown: "## Samsung Galaxy S25 Ultra\n- Chipset: Snapdragon 8 Elite\n- Camera: 200MP Main + 50MP Periscope + 50MP Ultrawide\n- Battery: 5000mAh with 45W fast charging",
    specifications: {
      brand: "Samsung",
      model: "SM-S928B/DS",
      weightGrams: 232,
      dimensionsCm: { length: 16.23, width: 7.9, height: 0.86 },
      color: "Titanium Gray",
      warrantyPeriodMonths: 12,
      countryOfManufacture: "Vietnam",
      batteryCapacityMah: 5000,
      processor: "Qualcomm Snapdragon 8 Elite (3nm)",
      ramGb: 12,
      storageGb: 512,
      certifications: ["PTA Approved", "CE", "FCC", "IP68 Dust & Water Resistant"]
    },
    inventoryDetails: {
      warehouseSku: "WH-KHI-AISLE-12-BAY-04",
      totalStock: 45,
      safetyStock: 10,
      reorderPoint: 15,
      binLocation: "KHI-MALL-ZONE-A-44",
      costPricePkr: 345000,
      supplierLeadTimeDays: 7,
      fulfillmentHubs: {
        karachiCentral: 25,
        lahoreMegaHub: 15,
        islamabadExpress: 5
      }
    },
    vendorInfo: {
      vendorId: "VND-SAMSUNG-OFFICIAL",
      vendorName: "Samsung Pakistan Authorized Mall Store",
      vendorTier: "Platinum",
      vendorRating: 4.95,
      dispatchSlaHours: 12,
      supportEmail: "darazmall@samsung-distributors.pk",
      ntnTaxNumber: "NTN-7392104-9",
      warehouseCity: "Karachi"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 24,
      returnWindowDays: 14,
      fragileHandlingRequired: true,
      customsTariffCode: "8517.13.00"
    },
    auditLog: {
      createdAt: "2026-01-15T08:30:00Z",
      updatedAt: "2026-09-20T14:22:15Z",
      version: 4,
      lastUpdatedBy: "catalog_mgr_asim@daraz.internal",
      checksum: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  },
  {
    id: "prod-102",
    sku: "DZ-ELEC-APL-IP16P-256",
    title: "Apple iPhone 16 Pro (256GB / Natural Titanium)",
    slug: "apple-iphone-16-pro-256gb-natural-titanium",
    brand: "Apple",
    category: "Electronics",
    subCategory: "Smartphones",
    price: 435000,
    compareAtPrice: 460000,
    currency: "PKR",
    discountPercentage: 5.4,
    stock: 28,
    rating: 4.92,
    ratingCount: 540,
    isAvailable: true,
    isFeatured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["apple", "ios", "ptaa-approved", "camera-control", "titanium"],

    descriptionHtml: "<div class='product-desc'><h2>Forged in Titanium with Camera Control</h2><p>The A18 Pro chip unlocks unprecedented performance for AAA gaming and pro video production with 4K 120 fps Dolby Vision capture.</p></div>",
    rawMarkdown: "## Apple iPhone 16 Pro\n- Chip: A18 Pro\n- Display: 6.3 inch Super Retina XDR with ProMotion\n- Camera: 48MP Fusion Camera with optical image stabilization",
    specifications: {
      brand: "Apple",
      model: "A3293",
      weightGrams: 199,
      dimensionsCm: { length: 14.96, width: 7.15, height: 0.825 },
      color: "Natural Titanium",
      warrantyPeriodMonths: 12,
      countryOfManufacture: "India",
      batteryCapacityMah: 3582,
      processor: "Apple A18 Pro (3nm 6-core)",
      ramGb: 8,
      storageGb: 256,
      certifications: ["PTA Approved", "Apple MFi", "IP68"]
    },
    inventoryDetails: {
      warehouseSku: "WH-LHE-SEC-BAY-09",
      totalStock: 28,
      safetyStock: 5,
      reorderPoint: 8,
      binLocation: "LHE-SECURE-VAULT-B2",
      costPricePkr: 395000,
      supplierLeadTimeDays: 14,
      fulfillmentHubs: {
        karachiCentral: 14,
        lahoreMegaHub: 10,
        islamabadExpress: 4
      }
    },
    vendorInfo: {
      vendorId: "VND-MERCANTILE-APL",
      vendorName: "Mercantile Official Apple Partner",
      vendorTier: "Platinum",
      vendorRating: 4.98,
      dispatchSlaHours: 8,
      supportEmail: "apple.support@mercantile.com.pk",
      ntnTaxNumber: "NTN-4820199-2",
      warehouseCity: "Lahore"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: false,
      expressDeliveryHours: 24,
      returnWindowDays: 7,
      fragileHandlingRequired: true,
      customsTariffCode: "8517.13.00"
    },
    auditLog: {
      createdAt: "2026-02-01T10:00:00Z",
      updatedAt: "2026-09-21T18:10:00Z",
      version: 7,
      lastUpdatedBy: "apple_sync_daemon",
      checksum: "sha256-4c2810a40c9bc2217c919a3b2b4d99c4f1c1f21184a4ec4101e4"
    }
  },
  {
    id: "prod-103",
    sku: "BZ-GROC-RICE-BAS-05",
    title: "Khaalis Super Kernel Basmati Rice (5 KG Pack)",
    slug: "khaalis-super-kernel-basmati-rice-5kg",
    brand: "Khaalis Harvest",
    category: "Groceries",
    subCategory: "Grains & Rice",
    price: 2450,
    compareAtPrice: 2800,
    currency: "PKR",
    discountPercentage: 12.5,
    stock: 350,
    rating: 4.75,
    ratingCount: 1420,
    isAvailable: true,
    isFeatured: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["bazaar-b2b", "bulk-grain", "export-quality", "grocery-staple"],

    descriptionHtml: "<div class='product-desc'><h2>Naturally Aged Himalayan Basmati</h2><p>Aged for a minimum of 24 months to ensure non-sticky, extra-long grain elongation up to 2.5x after steaming. Perfect for Biryani, Pulao, and restaurant catering.</p></div>",
    rawMarkdown: "## Khaalis Super Kernel Basmati Rice 5kg\n- Moisture: Less than 12%\n- Average grain length: 7.4mm\n- Broken grains: Under 2%",
    specifications: {
      brand: "Khaalis Harvest",
      model: "SK-BASMATI-EXP-2026",
      weightGrams: 5000,
      dimensionsCm: { length: 35, width: 22, height: 8 },
      color: "Pearlescent White",
      warrantyPeriodMonths: 24,
      countryOfManufacture: "Pakistan",
      shelfLifeDays: 730,
      certifications: ["PSQCA Certified", "ISO 22000", "Halal Pakistan"]
    },
    inventoryDetails: {
      warehouseSku: "WH-BZ-B2B-BULK-PALLET-88",
      totalStock: 350,
      safetyStock: 80,
      reorderPoint: 100,
      binLocation: "BZ-LHE-DRY-STORE-D3",
      costPricePkr: 1980,
      supplierLeadTimeDays: 3,
      fulfillmentHubs: {
        karachiCentral: 120,
        lahoreMegaHub: 180,
        islamabadExpress: 50
      }
    },
    vendorInfo: {
      vendorId: "VND-PUNJAB-AGRO",
      vendorName: "Punjab Agro Mills Hafizabad",
      vendorTier: "Gold",
      vendorRating: 4.82,
      dispatchSlaHours: 4,
      supportEmail: "orders@punjab-agro.pk",
      ntnTaxNumber: "NTN-2918844-1",
      warehouseCity: "Hafizabad"
    },
    shippingPolicy: {
      freeShippingEligible: false,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 48,
      returnWindowDays: 3,
      fragileHandlingRequired: false,
      customsTariffCode: "1006.30.10"
    },
    auditLog: {
      createdAt: "2026-03-10T11:20:00Z",
      updatedAt: "2026-09-22T06:14:00Z",
      version: 2,
      lastUpdatedBy: "bazaar_inventory_worker",
      checksum: "sha256-b092f8832a818812c7590218ef88c0a2"
    }
  },
  {
    id: "prod-104",
    sku: "DZ-ELEC-SONY-WH1000XM5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
    brand: "Sony",
    category: "Electronics",
    subCategory: "Audio & Wearables",
    price: 94999,
    compareAtPrice: 110000,
    currency: "PKR",
    discountPercentage: 13.6,
    stock: 62,
    rating: 4.85,
    ratingCount: 489,
    isAvailable: true,
    isFeatured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["sony", "anc", "hi-res", "bluetooth-5.2", "daraz-mall"],

    descriptionHtml: "<div class='product-desc'><h2>Industry Leading Noise Cancellation</h2><p>Two processors control 8 microphones for unprecedented noise cancellation. Auto NC Optimizer automatically optimizes sound based on atmospheric pressure.</p></div>",
    rawMarkdown: "## Sony WH-1000XM5\n- Battery life: 30 hours with ANC ON\n- Driver unit: 30mm precision carbon fiber\n- Codecs: LDAC, AAC, SBC",
    specifications: {
      brand: "Sony",
      model: "WH1000XM5/B",
      weightGrams: 250,
      dimensionsCm: { length: 22.5, width: 19.5, height: 7.2 },
      color: "Black Matte",
      warrantyPeriodMonths: 12,
      countryOfManufacture: "Malaysia",
      batteryCapacityMah: 1200,
      certifications: ["Hi-Res Wireless Audio", "CE", "FCC", "360 Reality Audio"]
    },
    inventoryDetails: {
      warehouseSku: "WH-KHI-AUDIO-BAY-14",
      totalStock: 62,
      safetyStock: 12,
      reorderPoint: 20,
      binLocation: "KHI-AUDIO-A-12",
      costPricePkr: 81000,
      supplierLeadTimeDays: 10,
      fulfillmentHubs: {
        karachiCentral: 32,
        lahoreMegaHub: 20,
        islamabadExpress: 10
      }
    },
    vendorInfo: {
      vendorId: "VND-SONY-DISTRIB-PK",
      vendorName: "Mehran Audio Visual (Sony Partner)",
      vendorTier: "Platinum",
      vendorRating: 4.89,
      dispatchSlaHours: 12,
      supportEmail: "support@mehran-sony.pk",
      ntnTaxNumber: "NTN-3184910-4",
      warehouseCity: "Karachi"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 24,
      returnWindowDays: 14,
      fragileHandlingRequired: true,
      customsTariffCode: "8518.30.00"
    },
    auditLog: {
      createdAt: "2026-02-12T09:15:00Z",
      updatedAt: "2026-09-18T16:45:00Z",
      version: 5,
      lastUpdatedBy: "catalog_sony_importer",
      checksum: "sha256-f81903bc88319eacba2019"
    }
  },
  {
    id: "prod-105",
    sku: "BZ-GROC-OIL-DALDA-5L",
    title: "Dalda Cooking Oil (5 Litre Tin)",
    slug: "dalda-cooking-oil-5-litre-tin",
    brand: "Dalda",
    category: "Groceries",
    subCategory: "Cooking Essentials",
    price: 3150,
    compareAtPrice: 3400,
    currency: "PKR",
    discountPercentage: 7.3,
    stock: 210,
    rating: 4.9,
    ratingCount: 3820,
    isAvailable: true,
    isFeatured: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["dalda", "cooking-oil", "vtamin-a-d", "bazaar-grocery", "staple"],

    descriptionHtml: "<div class='product-desc'><h2>Jahan Maamta Wahan Dalda</h2><p>Triple refined blend of pure Canola and Soybean oil enriched with Vitamins A, D, and E for cardiovascular health and balanced cholesterol.</p></div>",
    rawMarkdown: "## Dalda Cooking Oil 5L\n- Net Volume: 5 Litres\n- Ingredients: Canola & Soybean Oil, Vitamins A, D, E\n- Smoke Point: 232°C",
    specifications: {
      brand: "Dalda Foods",
      model: "DALDA-TIN-5L-2026",
      weightGrams: 4600,
      dimensionsCm: { length: 24, width: 17, height: 31 },
      color: "Amber Gold",
      warrantyPeriodMonths: 18,
      countryOfManufacture: "Pakistan",
      shelfLifeDays: 540,
      certifications: ["PSQCA Approved", "Halal Certified", "ISO 9001"]
    },
    inventoryDetails: {
      warehouseSku: "WH-BZ-GROC-RACK-07",
      totalStock: 210,
      safetyStock: 40,
      reorderPoint: 60,
      binLocation: "BZ-KHI-LIQUIDS-B4",
      costPricePkr: 2780,
      supplierLeadTimeDays: 2,
      fulfillmentHubs: {
        karachiCentral: 100,
        lahoreMegaHub: 80,
        islamabadExpress: 30
      }
    },
    vendorInfo: {
      vendorId: "VND-DALDA-FOODS-DIRECT",
      vendorName: "Dalda Foods Limited FMCG Division",
      vendorTier: "Platinum",
      vendorRating: 4.97,
      dispatchSlaHours: 6,
      supportEmail: "corporate.sales@daldafoods.com",
      ntnTaxNumber: "NTN-0818290-7",
      warehouseCity: "Karachi"
    },
    shippingPolicy: {
      freeShippingEligible: false,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 24,
      returnWindowDays: 3,
      fragileHandlingRequired: false,
      customsTariffCode: "1514.19.00"
    },
    auditLog: {
      createdAt: "2026-01-20T10:00:00Z",
      updatedAt: "2026-09-22T08:11:00Z",
      version: 8,
      lastUpdatedBy: "fmcg_price_feed",
      checksum: "sha256-78ab8120c19280"
    }
  },
  {
    id: "prod-106",
    sku: "DZ-APPL-PHILIPS-AF9252",
    title: "Philips Airfryer XXL Essential (4.1 Litre / 1400W)",
    slug: "philips-airfryer-xxl-essential-4-1l",
    brand: "Philips",
    category: "Home & Kitchen",
    subCategory: "Kitchen Appliances",
    price: 36499,
    compareAtPrice: 42000,
    currency: "PKR",
    discountPercentage: 13.1,
    stock: 34,
    rating: 4.79,
    ratingCount: 215,
    isAvailable: true,
    isFeatured: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["philips", "airfryer", "healthy-cooking", "kitchen", "daraz-mall"],

    descriptionHtml: "<div class='product-desc'><h2>Rapid Air Technology with 90% Less Fat</h2><p>Cook delicious meals that are crispy on the outside and tender on the inside with little to no added oil. Includes NutriU recipe app integration.</p></div>",
    rawMarkdown: "## Philips Essential Airfryer\n- Power: 1400 Watts\n- Basket Capacity: 4.1L (0.8kg fries)\n- Preset cooking functions: 7 touch presets",
    specifications: {
      brand: "Philips Domestic Appliances",
      model: "HD9252/90",
      weightGrams: 4550,
      dimensionsCm: { length: 36, width: 26.4, height: 29.5 },
      color: "Deep Black",
      warrantyPeriodMonths: 24,
      countryOfManufacture: "China",
      material: "BPA-Free High Heat Plastic and Non-Stick Steel",
      certifications: ["CE", "CB", "TUV Rheinland Certified"]
    },
    inventoryDetails: {
      warehouseSku: "WH-LHE-APPL-BAY-22",
      totalStock: 34,
      safetyStock: 6,
      reorderPoint: 10,
      binLocation: "LHE-APPL-AISLE-3",
      costPricePkr: 29500,
      supplierLeadTimeDays: 12,
      fulfillmentHubs: {
        karachiCentral: 16,
        lahoreMegaHub: 12,
        islamabadExpress: 6
      }
    },
    vendorInfo: {
      vendorId: "VND-PHILIPS-PK",
      vendorName: "Philips Consumer Lifestyle Pakistan",
      vendorTier: "Platinum",
      vendorRating: 4.88,
      dispatchSlaHours: 12,
      supportEmail: "service@philips.pk",
      ntnTaxNumber: "NTN-1940124-3",
      warehouseCity: "Lahore"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 24,
      returnWindowDays: 14,
      fragileHandlingRequired: true,
      customsTariffCode: "8516.60.00"
    },
    auditLog: {
      createdAt: "2026-03-01T14:10:00Z",
      updatedAt: "2026-09-15T11:20:00Z",
      version: 3,
      lastUpdatedBy: "appliances_lead",
      checksum: "sha256-91e84a22b1049"
    }
  },
  {
    id: "prod-107",
    sku: "DZ-FASH-JUNAID-KURTA-01",
    title: "J. Junaid Jamshed Men's Raw Silk Embroidered Kurta",
    slug: "j-junaid-jamshed-mens-raw-silk-embroidered-kurta",
    brand: "J. (Junaid Jamshed)",
    category: "Fashion",
    subCategory: "Ethnic Menswear",
    price: 8990,
    compareAtPrice: 10500,
    currency: "PKR",
    discountPercentage: 14.3,
    stock: 85,
    rating: 4.68,
    ratingCount: 630,
    isAvailable: true,
    isFeatured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["eastern-wear", "eid-collection", "mens-fashion", "j."],

    descriptionHtml: "<div class='product-desc'><h2>Traditional Craftsmanship Meets Modern Cut</h2><p>Woven from authentic Raw Silk fabric with intricate thread embroidery across band collar and placket. Ideal for festive gatherings and wedding events.</p></div>",
    rawMarkdown: "## J. Raw Silk Kurta\n- Fabric: 100% Blended Silk\n- Fit: Regular Fit\n- Care: Dry clean recommended",
    specifications: {
      brand: "J. Junaid Jamshed",
      model: "JJ-KURTA-SILK-26",
      weightGrams: 380,
      dimensionsCm: { length: 42, width: 28, height: 3 },
      color: "Charcoal Slate",
      warrantyPeriodMonths: 0,
      countryOfManufacture: "Pakistan",
      material: "Handloom Raw Silk",
      certifications: ["OEKO-TEX Standard 100", "Pakistan Textile Board"]
    },
    inventoryDetails: {
      warehouseSku: "WH-KHI-TEX-RACK-90",
      totalStock: 85,
      safetyStock: 15,
      reorderPoint: 25,
      binLocation: "KHI-APPAREL-C1",
      costPricePkr: 5200,
      supplierLeadTimeDays: 5,
      fulfillmentHubs: {
        karachiCentral: 45,
        lahoreMegaHub: 30,
        islamabadExpress: 10
      }
    },
    vendorInfo: {
      vendorId: "VND-JJ-FLAGSHIP",
      vendorName: "Junaid Jamshed E-Commerce Flagship",
      vendorTier: "Platinum",
      vendorRating: 4.91,
      dispatchSlaHours: 12,
      supportEmail: "eshop@junaidjamshed.com",
      ntnTaxNumber: "NTN-0294817-5",
      warehouseCity: "Karachi"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 24,
      returnWindowDays: 14,
      fragileHandlingRequired: false,
      customsTariffCode: "6205.20.00"
    },
    auditLog: {
      createdAt: "2026-02-28T09:00:00Z",
      updatedAt: "2026-09-19T13:40:00Z",
      version: 4,
      lastUpdatedBy: "fashion_curator_zainab",
      checksum: "sha256-a1490b83ef28"
    }
  },
  {
    id: "prod-108",
    sku: "DZ-ELEC-DELL-XPS15",
    title: "Dell XPS 15 OLED (Intel Core Ultra 7 / 32GB RAM / 1TB SSD)",
    slug: "dell-xps-15-oled-intel-core-ultra-7-32gb-1tb",
    brand: "Dell",
    category: "Electronics",
    subCategory: "Laptops & Computers",
    price: 585000,
    compareAtPrice: 620000,
    currency: "PKR",
    discountPercentage: 5.6,
    stock: 12,
    rating: 4.81,
    ratingCount: 94,
    isAvailable: true,
    isFeatured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: ["dell", "xps", "oled", "creator-laptop", "intel-core-ultra"],

    descriptionHtml: "<div class='product-desc'><h2>Ultimate Creator Machine</h2><p>Stunning 3.5K OLED InfinityEdge touch screen calibrated with 100% DCI-P3 color gamut, powered by Intel Core Ultra 7 and NVIDIA GeForce RTX 4060 graphics.</p></div>",
    rawMarkdown: "## Dell XPS 15 9530\n- Processor: Intel Core Ultra 7 155H\n- Display: 15.6 inch 3.5K OLED Touch\n- GPU: NVIDIA RTX 4060 8GB GDDR6",
    specifications: {
      brand: "Dell Inc",
      model: "XPS-9530-U7",
      weightGrams: 1920,
      dimensionsCm: { length: 34.4, width: 23.0, height: 1.8 },
      color: "Platinum Silver with Black Carbon Fiber",
      warrantyPeriodMonths: 24,
      countryOfManufacture: "China",
      batteryCapacityMah: 7200,
      processor: "Intel Core Ultra 7 155H (16-core, 22-threads)",
      ramGb: 32,
      storageGb: 1024,
      certifications: ["Intel Evo Certified", "Energy Star 8.0", "EPEAT Gold"]
    },
    inventoryDetails: {
      warehouseSku: "WH-ISB-TECH-BAY-03",
      totalStock: 12,
      safetyStock: 2,
      reorderPoint: 4,
      binLocation: "ISB-SECURE-AISLE-1",
      costPricePkr: 520000,
      supplierLeadTimeDays: 20,
      fulfillmentHubs: {
        karachiCentral: 5,
        lahoreMegaHub: 4,
        islamabadExpress: 3
      }
    },
    vendorInfo: {
      vendorId: "VND-DELL-PAK-DIST",
      vendorName: "Mega Computers Official Dell Distributor",
      vendorTier: "Platinum",
      vendorRating: 4.96,
      dispatchSlaHours: 24,
      supportEmail: "enterprise@megacomputers.pk",
      ntnTaxNumber: "NTN-4182940-8",
      warehouseCity: "Islamabad"
    },
    shippingPolicy: {
      freeShippingEligible: true,
      cashOnDeliveryAllowed: false,
      expressDeliveryHours: 24,
      returnWindowDays: 7,
      fragileHandlingRequired: true,
      customsTariffCode: "8471.30.00"
    },
    auditLog: {
      createdAt: "2026-03-05T12:00:00Z",
      updatedAt: "2026-09-20T17:00:00Z",
      version: 3,
      lastUpdatedBy: "it_hardware_team",
      checksum: "sha256-4c91a0b38c"
    }
  }
];

// In-memory catalog state with helper methods
let productsCatalog: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));

export function getCatalog(): Product[] {
  return productsCatalog;
}

export function findProductById(id: string): Product | undefined {
  return productsCatalog.find(p => p.id === id);
}

export function addProduct(newProductData: Partial<Product>): Product {
  const id = newProductData.id || `prod-${Date.now().toString().slice(-4)}`;
  const product: Product = {
    id,
    sku: newProductData.sku || `DZ-GEN-${Date.now().toString().slice(-6)}`,
    title: newProductData.title || "Untitled Product",
    slug: (newProductData.title || "untitled-product").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    brand: newProductData.brand || "Generic",
    category: newProductData.category || "General",
    subCategory: newProductData.subCategory || "General",
    price: Number(newProductData.price) || 1000,
    compareAtPrice: Number(newProductData.compareAtPrice) || Number(newProductData.price || 1000),
    currency: "PKR",
    discountPercentage: 0,
    stock: Number(newProductData.stock) || 10,
    rating: 5.0,
    ratingCount: 1,
    isAvailable: true,
    isFeatured: Boolean(newProductData.isFeatured),
    thumbnailUrl: newProductData.thumbnailUrl || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60",
    galleryImages: [
      newProductData.thumbnailUrl || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000&auto=format&fit=crop&q=80"
    ],
    tags: newProductData.tags || ["new-arrival", "daraz-verified"],

    descriptionHtml: newProductData.descriptionHtml || `<p>${newProductData.title || 'Product description'}</p>`,
    rawMarkdown: newProductData.rawMarkdown || `## ${newProductData.title || 'Product'}\nAdded via REST API`,
    specifications: newProductData.specifications || {
      brand: newProductData.brand || "Generic",
      model: "Standard",
      weightGrams: 500,
      dimensionsCm: { length: 20, width: 15, height: 5 },
      color: "Standard",
      warrantyPeriodMonths: 6,
      countryOfManufacture: "Pakistan",
      certifications: ["Verified"]
    },
    inventoryDetails: newProductData.inventoryDetails || {
      warehouseSku: `WH-${id}`,
      totalStock: Number(newProductData.stock) || 10,
      safetyStock: 2,
      reorderPoint: 5,
      binLocation: "ZONE-A",
      costPricePkr: (Number(newProductData.price) || 1000) * 0.8,
      supplierLeadTimeDays: 3,
      fulfillmentHubs: {
        karachiCentral: Math.floor((Number(newProductData.stock) || 10) * 0.5),
        lahoreMegaHub: Math.floor((Number(newProductData.stock) || 10) * 0.3),
        islamabadExpress: Math.floor((Number(newProductData.stock) || 10) * 0.2)
      }
    },
    vendorInfo: newProductData.vendorInfo || {
      vendorId: "VND-LOCAL-MERCHANT",
      vendorName: "Bazaar Verified Marketplace Partner",
      vendorTier: "Verified",
      vendorRating: 4.8,
      dispatchSlaHours: 24,
      supportEmail: "vendor@bazaar.pk",
      ntnTaxNumber: "NTN-9988776-1",
      warehouseCity: "Lahore"
    },
    shippingPolicy: newProductData.shippingPolicy || {
      freeShippingEligible: false,
      cashOnDeliveryAllowed: true,
      expressDeliveryHours: 48,
      returnWindowDays: 7,
      fragileHandlingRequired: false,
      customsTariffCode: "9999.99.99"
    },
    auditLog: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      lastUpdatedBy: "rest_api_client",
      checksum: `sha256-${Date.now().toString(16)}`
    }
  };

  productsCatalog.unshift(product);
  return product;
}

export function updateProduct(id: string, updatedData: Partial<Product>, isPut: boolean = false): Product | null {
  const index = productsCatalog.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }

  const existing = productsCatalog[index];

  if (isPut) {
    // Idempotent full replacement
    const replaced: Product = {
      ...existing,
      ...updatedData,
      id, // Immutable ID
      auditLog: {
        ...existing.auditLog,
        updatedAt: new Date().toISOString(),
        version: existing.auditLog.version + 1,
        lastUpdatedBy: "idempotent_put_operation"
      }
    };
    productsCatalog[index] = replaced;
    return replaced;
  } else {
    // Partial PATCH
    const merged: Product = {
      ...existing,
      ...updatedData,
      id,
      auditLog: {
        ...existing.auditLog,
        updatedAt: new Date().toISOString(),
        version: existing.auditLog.version + 1,
        lastUpdatedBy: "patch_operation"
      }
    };
    productsCatalog[index] = merged;
    return merged;
  }
}

export function deleteProduct(id: string): boolean {
  const index = productsCatalog.findIndex(p => p.id === id);
  if (index === -1) {
    return false;
  }
  productsCatalog.splice(index, 1);
  return true;
}

export function resetCatalogToDefault(): void {
  productsCatalog = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
}
