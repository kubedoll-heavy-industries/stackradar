import { describe, expect, it } from "vitest";

import { uuidParamSchema } from "../../../src/schemas/common.schema.js";

/**
 * The `clusters` table predates the current UUID generator: the community
 * edition's `local` cluster was seeded with a UUID-shaped id that carries
 * neither an RFC 9562 version nibble nor a variant nibble
 * (3a4aba07-4057-d3af-…). Postgres's `uuid` type accepts it, but Zod's
 * strict `z.uuid()` did not, so every cluster-scoped URL returned
 * "Invalid ID format". Route params validate the shape only.
 */
describe("legacy cluster identifiers", () => {
    it("accepts a UUID-shaped id without RFC version/variant bits", () => {
        expect(
            uuidParamSchema.safeParse({ id: "3a4aba07-4057-d3af-6bce-698516dbfd4e" }).success,
        ).toBe(true);
    });

    it("still accepts standard v4 and v7 ids", () => {
        expect(uuidParamSchema.safeParse({ id: "685fcf78-eeca-44e1-accb-a25f2e95c0f7" }).success).toBe(
            true,
        );
        expect(uuidParamSchema.safeParse({ id: "01a185bc-1bb3-7c2b-b168-1d518d423b57" }).success).toBe(
            true,
        );
    });

    it("rejects strings that are not UUID-shaped", () => {
        expect(uuidParamSchema.safeParse({ id: "not-a-guid" }).success).toBe(false);
        expect(uuidParamSchema.safeParse({ id: "3a4aba07-4057-d3af-6bce" }).success).toBe(false);
    });
});
