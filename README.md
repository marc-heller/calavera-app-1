This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# GraphIQL

query {
  as(token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJraWQiOiJmNTg3OTBkMTciLCJpZCI6ImM1YWRiZWM0LTRkZjQtNDhlMC1iY2RlLTMxZmYxYjgxOGE5MiIsInJvbGUiOiJDVVNUT01FUiIsInN1YnR5cGUiOm51bGwsImNvdW50cnkiOiJHQiIsInB0IjoiREVGQVVMVCIsImlmIjoiIiwiY2lkIjoiZTk3MDEyYzYtOGE3Ni00NzNmLTljZjctMzBlMGU2ZjI3MWRhIiwiZ2VvX2NvdW50cnkiOiJHQiIsImFwaSI6dHJ1ZSwiYXBpX2giOnRydWUsImFwaV9jIjp0cnVlLCJhcGlfbyI6dHJ1ZSwiYXBpX3IiOnRydWUsImlhdCI6MTc2NDE2OTIxMywiZXhwIjoxNzY0MjU1NjEzfQ.ahT5_t1FInth6uXapz1Xk1lDwJXfj1bNBpJ4xj1jMMM") {
    diamonds_by_query (
      offset: 50,
      limit: 50,
      order: {
        type: price,
        direction: ASC
      },
      query: {
        labgrown: false,
        preferred_currency: USD,
        dollar_value: {
          from: 200,
          to: 500000
        },
        dollar_per_carat: {
          from: 0,
          to: 50000
        },

        sizes: [{
          from: 0.15,
          to: 35
        }],
        color: [M,L,K,J,I,H,G,F,E,D],
        cut: [G,VG,EX,ID],
        clarity: [SI2,SI1,VS2,VS1,IF,FL],
        flouresence: [NON,FNT,MED,STG,VST],
        table_percentage: {
          from: 0,
          to: 100
        }
        depth_percentage: {
          from: 0,
          to: 100
        },
        polish: [G,VG,EX],
        symmetry: [G,VG,EX],
        ratio: {
          from: 1,
          to: 2.75
        },
        length_mm: {
          from: 3,
          to: 20
        },
        width_mm: {
          from: 3,
          to: 20
        },
        depth_mm: {
          from: 2,
          to: 12
        },
        crown_angle: {
          from: 23,
          to: 40
        },
        pav_angle: {
          from: 38,
          to: 43
        },
        girdle: [ETN,VTN,THN,MED,STK,THK,VTK,ETK],

        has_image: true,
      }
    ) {
      items {
        id
        diamond {
          id
          video
          image
          availability
          supplierStockId
          brown
          green
          milky
          eyeClean
          mine_of_origin
          certificate {
            id
            lab
            labgrown
            shape
            certNumber
            cut
            carats
            clarity
            polish
            symmetry
            color
            width
            length
            depth
            girdle
            floInt
            floCol
            depthPercentage
            table
          }
        }
        price
        discount
      }
      total_count,
      result_count
    }
  }
}
      