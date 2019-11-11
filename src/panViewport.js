/*eslint no-unused-vars: 0*/
'use strict';

import FabricCanvasTool from './fabrictool'
const fabric = require('fabric').fabric;

class PanViewport extends FabricCanvasTool {
    panBounds = null;

    constructor(canvas, bounds) {
        super(canvas);

        this.panBounds = bounds;
    }

    configureCanvas(props) {
        let canvas = this._canvas;
        canvas.isDrawingMode = canvas.selection = false;
        canvas.forEachObject((o) => o.selectable = o.evented = false);
        //Change the cursor to the move grabber
        canvas.defaultCursor = 'move';
    }

    doMouseDown(o) {
        let canvas = this._canvas;
        this.isDown = true;
        let pointer = canvas.getPointer(o.e);
        this.startX = pointer.x;
        this.startY = pointer.y;
    }

    doMouseMove(o) {
        if (!this.isDown) return;
        if (!this.panBounds) return;
        let canvas = this._canvas;
        let pointer = canvas.getPointer(o.e);

        let moveToX = pointer.x - this.startX;
        let moveToY = pointer.y - this.startY;

        const minX = (this.panBounds.maxX - canvas.getWidth()) * -1;
        const minY = (this.panBounds.maxY - canvas.getHeight()) * -1;

        if (canvas.viewportTransform.length >= 6) {
            if (canvas.viewportTransform[4] + moveToX <= minX || canvas.viewportTransform[4] + moveToX >= 0) {
                moveToX = 0;
            }

            if (canvas.viewportTransform[5] + moveToY <= minY || canvas.viewportTransform[5] + moveToY >= 0) {
                moveToY = 0;
            }

            canvas.viewportTransform[4] += moveToX;
            canvas.viewportTransform[5] += moveToY;
        }

        canvas.renderAll();
    }

    doMouseUp(o) {
        this.isDown = false;
    }

}

export default PanViewport;