import uPlot, { Options } from "uplot";
import { Flag } from "../page";
import { getFlagForPoint } from "./utils";

export function seriesPointsPlugin(flags: Flag[] = []) {
  function drawFlagMarker(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const shapeSize = 8
  
    ctx.beginPath();

    ctx.moveTo(cx - shapeSize, cy - shapeSize)
    ctx.lineTo(cx + shapeSize, cy + shapeSize)
    ctx.moveTo(cx - shapeSize, cy + shapeSize)
    ctx.lineTo(cx + shapeSize, cy - shapeSize)

    ctx.closePath();
    ctx.stroke()
  }

  function drawFlaggedPoints(u: uPlot, i: number, i0: number, i1: number) {
    const { ctx } = u;
    const { _stroke, scale } = u.series[i];

    ctx.save();

    // ctx.fillStyle = _stroke;
    ctx.lineWidth = 3
    // ctx.strokeStyle = invertHex(_stroke)

    let j = i0;

    const seriesFlags = flags.filter(x => x.seriesIndex === i)
    while (j <= i1) {
      if (getFlagForPoint(seriesFlags, j)) {
        const val = u.data[i][j];
        const cx = Math.round(u.valToPos(u.data[0][j], 'x', true));
        const cy = Math.round(u.valToPos(val!, scale!, true));
        drawFlagMarker(ctx, cx, cy);
      }
      j++;
    };

    ctx.restore();
    return true
  }

  return {
    opts: (u: uPlot, opts: Options) => {
      opts.series.forEach((s, i) => {
        if (i > 0) {
          uPlot.assign(s, {
            points: {
              show: drawFlaggedPoints
            }
          });
        }
      });
    }
  };
}
