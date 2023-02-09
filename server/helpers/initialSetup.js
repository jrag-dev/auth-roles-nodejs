import Role from '../models/roles.model.js'

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;
  
    const values = await Promise.all([
      new Role({ name: 'user'}).save(),
      new Role({ name: 'admin'}).save(),
      new Role({ name: 'employeer'}).save()
    ])
  
    console.log(values);
  } catch (err) {
    console.error(err);
  }
}