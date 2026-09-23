import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  graphql
} from 'graphql';
import { getCatalog, findProductById, addProduct } from '../data/products';

// Sub-types for complex specifications
const DimensionsType = new GraphQLObjectType({
  name: 'Dimensions',
  fields: {
    length: { type: GraphQLFloat },
    width: { type: GraphQLFloat },
    height: { type: GraphQLFloat }
  }
});

const SpecificationsType = new GraphQLObjectType({
  name: 'Specifications',
  fields: {
    brand: { type: GraphQLString },
    model: { type: GraphQLString },
    weightGrams: { type: GraphQLFloat },
    dimensionsCm: { type: DimensionsType },
    color: { type: GraphQLString },
    warrantyPeriodMonths: { type: GraphQLInt },
    countryOfManufacture: { type: GraphQLString },
    batteryCapacityMah: { type: GraphQLInt },
    processor: { type: GraphQLString },
    ramGb: { type: GraphQLInt },
    storageGb: { type: GraphQLInt },
    material: { type: GraphQLString },
    certifications: { type: new GraphQLList(GraphQLString) }
  }
});

const FulfillmentHubsType = new GraphQLObjectType({
  name: 'FulfillmentHubs',
  fields: {
    karachiCentral: { type: GraphQLInt },
    lahoreMegaHub: { type: GraphQLInt },
    islamabadExpress: { type: GraphQLInt }
  }
});

const InventoryDetailsType = new GraphQLObjectType({
  name: 'InventoryDetails',
  fields: {
    warehouseSku: { type: GraphQLString },
    totalStock: { type: GraphQLInt },
    safetyStock: { type: GraphQLInt },
    reorderPoint: { type: GraphQLInt },
    binLocation: { type: GraphQLString },
    costPricePkr: { type: GraphQLFloat },
    supplierLeadTimeDays: { type: GraphQLInt },
    fulfillmentHubs: { type: FulfillmentHubsType }
  }
});

const VendorInfoType = new GraphQLObjectType({
  name: 'VendorInfo',
  fields: {
    vendorId: { type: GraphQLString },
    vendorName: { type: GraphQLString },
    vendorTier: { type: GraphQLString },
    vendorRating: { type: GraphQLFloat },
    dispatchSlaHours: { type: GraphQLInt },
    supportEmail: { type: GraphQLString },
    warehouseCity: { type: GraphQLString }
  }
});

const ShippingPolicyType = new GraphQLObjectType({
  name: 'ShippingPolicy',
  fields: {
    freeShippingEligible: { type: GraphQLBoolean },
    cashOnDeliveryAllowed: { type: GraphQLBoolean },
    expressDeliveryHours: { type: GraphQLInt },
    returnWindowDays: { type: GraphQLInt },
    fragileHandlingRequired: { type: GraphQLBoolean },
    customsTariffCode: { type: GraphQLString }
  }
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Enterprise E-Commerce Product Resource with deep nested inventory and specs',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    sku: { type: GraphQLString },
    title: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLString },
    brand: { type: GraphQLString },
    category: { type: GraphQLString },
    subCategory: { type: GraphQLString },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    compareAtPrice: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    discountPercentage: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    rating: { type: GraphQLFloat },
    ratingCount: { type: GraphQLInt },
    isAvailable: { type: GraphQLBoolean },
    isFeatured: { type: GraphQLBoolean },
    thumbnailUrl: { type: GraphQLString },
    galleryImages: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },

    // Heavy fields solved by client-driven selection
    descriptionHtml: { type: GraphQLString },
    specifications: { type: SpecificationsType },
    inventoryDetails: { type: InventoryDetailsType },
    vendorInfo: { type: VendorInfoType },
    shippingPolicy: { type: ShippingPolicyType }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Get all products with optional filters
    products: {
      type: new GraphQLList(ProductType),
      args: {
        category: { type: GraphQLString },
        search: { type: GraphQLString },
        limit: { type: GraphQLInt },
        page: { type: GraphQLInt }
      },
      resolve: (_, args) => {
        let items = getCatalog();
        if (args.category) {
          items = items.filter(p => p.category.toLowerCase() === args.category.toLowerCase());
        }
        if (args.search) {
          const q = args.search.toLowerCase();
          items = items.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        }
        if (args.page || args.limit) {
          const limit = args.limit || 10;
          const page = args.page || 1;
          const start = (page - 1) * limit;
          items = items.slice(start, start + limit);
        }
        return items;
      }
    },

    // Single product by ID
    product: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, { id }) => {
        const product = findProductById(id);
        if (!product) {
          throw new Error(`Product with ID '${id}' not found`);
        }
        return product;
      }
    },

    // All available categories
    categories: {
      type: new GraphQLList(GraphQLString),
      resolve: () => {
        const items = getCatalog();
        return Array.from(new Set(items.map(p => p.category)));
      }
    }
  }
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createProduct: {
      type: ProductType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        stock: { type: GraphQLInt }
      },
      resolve: (_, args) => {
        return addProduct({
          title: args.title,
          price: args.price,
          category: args.category,
          stock: args.stock || 10
        });
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});

/**
 * Execute GraphQL query against schema
 */
export async function executeGraphQL(query: string, variables?: Record<string, any>, operationName?: string) {
  return await graphql({
    schema,
    source: query,
    variableValues: variables,
    operationName
  });
}
