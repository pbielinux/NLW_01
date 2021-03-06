/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Knex } from 'knex';

// CREATE TABLE
export async function up(knex: Knex) {
	return knex.schema.createTable('items', table => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.string('title').notNullable();
	});
};

// DELETE TABLE
export async function down(knex: Knex) {
	return knex.schema.dropTable('items');
};
