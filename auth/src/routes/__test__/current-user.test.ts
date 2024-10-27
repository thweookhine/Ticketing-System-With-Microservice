import request from 'supertest'
import {app} from '../../app'

it('Responds with details about current user.', async () => {
    const cookie = await global.signup();
    if(cookie) {
        const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie',cookie)
        .send()
        .expect(200)
    
        expect(response.body.currentUser.email).toEqual('test@test.com')
    
    }else{
        fail('Signup did not provide cookie.')
    }
})

it('Responds with null value if not authenticated', async () => {
    const response = await request(app)
                            .get('/api/users/currentuser')
                            .expect(200);
    expect(response.body.currentUser).toEqual(null);

})