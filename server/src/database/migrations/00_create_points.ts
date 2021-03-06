/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Knex } from 'knex';

// CREATE TABLE
export async function up(knex: Knex) {
	return knex.schema.createTable('points', table => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table.string('whatsapp').notNullable();
		table.decimal('latitude').notNullable();
		table.decimal('longitude').notNullable();
		table.string('city').notNullable();
		table.string('uf', 2).notNullable();
	});
};

// DELETE TABLE
export async function down(knex: Knex) {
	return knex.schema.dropTable('points');
};
