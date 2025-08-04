use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

protected function failedValidation(Validator $validator)
{
    throw new HttpResponseException(response()->json([
        'errors' => $validator->errors()
    ], 422));
}
