import { Request, Response } from 'express';
import knex from "../database/connection";

class PointsController {
	async index(request: Request, response: Response) {
		// City, UF, Items (Query Params)
		const { city, uf, items } = request.query;

		const parsedItems = String(items)
			.split(',')
			.map(item => Number(item.trim()));

		const points = await knex('points')
			.join('point_items', 'points.id', '=', 'point_items.point_id')
			.whereIn('point_items.item_id', parsedItems) // Get all points that have the parsedItems
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()				// If point meet multiple requirements, only return once
			.select('points.*');

		return response.json(points);
	};

	async show(request: Request, response: Response) {
		const { id } = request.params;

		const point = await knex('points').where('id', id).first();

		if (!point) {
			return response.status(400).json({ message: 'Point not found.'}); // Status code beginning with 4 its an error
		};

		/*
		* SELECT * FROM items
		*			JOIN point_items ON items.id = point_items.item_id
		*		WHERE point_items.items_id = { id }
		*/
		const items = await knex('items')
			.join('point_items', 'items.id', '=', 'point_items.item_id')
			.where('point_items.point_id', id)
			.select('items.title');

		return response.json({ point, items });
	};

	async create(request: Request, response: Response) {
		const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

		// Create knex transaction, if the first query fail the second doesn't execute
		const trx = await knex.transaction();

		const point = {
			image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf
		};

		const insertedIds = await trx('points').insert(point);
		const point_id = insertedIds[0];
		const pointItems = items.map((item_id: number) => {
			return {
				item_id,
				point_id
			};
		});
		// Relationship with Items Tables
		await trx('point_items').insert(pointItems);

		await trx.commit();

		return response.json({
			id: point_id,
			...point,
		});
	};
};

export default PointsController;
