const { neon } = require('@neondatabase/serverless');
require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function clean() {
    const runs = await sql`SELECT * FROM payroll_runs`;
    console.log("Found runs:", runs.length);

    // Group by month, year, admin_id to find duplicates
    const grouped = {};
    for (const r of runs) {
        const key = `${r.month}-${r.year}-${r.admin_id}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
    }

    for (const key in grouped) {
        if (grouped[key].length > 1) {
            console.log(`Duplicates for ${key}:`, grouped[key].length);
            // Keep only one run (the first one) and delete the rest
            const keepIds = [grouped[key][0].id];
            const deleteIds = grouped[key].slice(1).map(r => r.id);

            console.log('Deleting runs:', deleteIds);
            if (deleteIds.length > 0) {
                for (const id of deleteIds) {
                    await sql`DELETE FROM payslips WHERE payroll_run_id = ${id}`;
                    await sql`DELETE FROM payroll_runs WHERE id = ${id}`;
                }
            }
        }
    }
    console.log("Cleanup done.");
}

clean().catch(console.error);
