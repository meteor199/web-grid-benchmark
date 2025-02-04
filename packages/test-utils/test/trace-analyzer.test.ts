import { assert, describe, expect, it } from 'vitest'
import path from 'path';


const TRACELOGS_PATH = path.resolve(__dirname, 'fixtures', 'tracelogs');



describe('trace-analyzer', () => {
    // it('wait-200ms', async () => {
    //     const parsed = await parseTracelog('wait-200ms.json');
    //     expect(parsed).toEqual({
    //         "GPU": 12.489,
    //         "Other": 2363.645,
    //         "Painting": 0.727,
    //         "Rendering": 0.729,
    //         "Scripting": 199.727,
    //     });
    // })

    it('ag-grid benchmark', async () => {
        // const parsed = await parseDistTracelog('ag-grid_01_render_100K_rows_1.json');
        // console.log(parsed);
    })
})

