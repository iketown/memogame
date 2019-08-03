import React from "react"
import { useItemCtx } from "../contexts/ItemContext"
import { Card, CardContent, Typography } from "@material-ui/core"
import styled from "styled-components"
import ShowMe from "../utils/ShowMe"
import { useItemFilterCtx } from "../contexts/ItemFilterCtx"

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  .attr-column {
    grid-column: 1;
    border: 1px solid grey;
  }
  .solo-link {
    cursor: pointer;
  }
  .solo-link-selected {
    cursor: pointer;
    font-weight: bold;
    text-decoration: underline;
  }
  .solo-link-unselected {
    cursor: pointer;
    opacity: 0.2;
  }
`
//
//
const ItemChart = () => {
  const { itemsAttrsObj } = useItemCtx()
  const { toggleSoloAttr, state } = useItemFilterCtx()
  return (
    <div>
      <Card>
        <CardContent>
          <ChartGrid>
            {Object.entries(itemsAttrsObj).map(([attrId, _opts]) => {
              const { name, ...opts } = _opts
              return (
                <>
                  <div className="attr-column">{name}</div>
                  <div>
                    {Object.entries(opts).map(([optId, optInfo]) => {
                      return (
                        <>
                          {" "}
                          <Typography
                            onClick={() => toggleSoloAttr({ attrId, optId })}
                            component="span"
                            variant="subtitle2"
                            className={
                              state.soloAttr && state.soloAttr.optId === optId
                                ? "solo-link-selected"
                                : state.soloAttr
                                ? "solo-link-unselected"
                                : "solo-link"
                            }
                          >
                            {optInfo.text}
                          </Typography>
                          {": "}
                          <Typography component="span" color="textSecondary">
                            {optInfo.items.length}
                          </Typography>
                        </>
                      )
                    })}
                  </div>
                </>
              )
            })}
          </ChartGrid>
          {/* <ShowMe obj={state} name="state" noModal /> */}
        </CardContent>
      </Card>
      <ShowMe obj={itemsAttrsObj} name="itemsAttrsObj" />
    </div>
  )
}

export default ItemChart
