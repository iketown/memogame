// import React from "react"
// import { CardContent, Card, Grid, Typography } from "@material-ui/core"
// import styled from "styled-components"
// //
// import { useAttrCtx } from "../contexts/AttrContext"
// import { useItemCtx } from "../contexts/ItemContext"
// import ItemCard from "../components/ItemCard.jsx"
// import ShowMe from "../utils/ShowMe"
// //
// //
// const Cards = () => {
//   const { allItems } = useItemCtx()
//   if (!allItems) return <div>no items. ?</div>
//   return (
//     <Grid container spacing={2}>
//       {/* <Grid item xs={12}>
//         <ShowMe obj={allItems} name="allItems" noModal />
//       </Grid> */}
//       {Object.entries(allItems).map(([itemId, item]) => {
//         return (
//           <Grid key={itemId} item xs={6} sm={4} md={3} lg={2}>
//             <ItemCard item={item} />
//           </Grid>
//         )
//       })}
//     </Grid>
//   )
// }

// export default Cards
